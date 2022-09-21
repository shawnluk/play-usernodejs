const db = require('../../db/db')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const moment = require('moment')

function switchRes (newDate) {
    switch ( newDate ) {
        case 1:
            return '周一'
        case 2:
            return '周二'
        case 3:
            return '周三'
        case 4:
            return '周四'
        case 5:
            return '周五'
        case 6:
            return '周六'
        case 0:
            return '周日'
    }


}

function createActivity (req, res) {
    // res.send('创建活动成功')
    // console.log(req.body)
    db.query(`select 1`, (err, result) => {
        if (err) {
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })
    const date2 = moment(req.body.date2).utc(8).format('HH:mm:ss')
    const date1 = moment(req.body.date1).utc(8).format('YYYY-MM-DD')
    // console.log('date1:'+date1)
    // console.log('date2:'+date2)
    const weekDate = moment(req.body.date1).day()
    const week = switchRes(weekDate)
    const dateActivity = date1 + "\xa0" + week + "\xa0" + date2

    const teamName = req.body.teamName
    const teamID = req.body.teamID
    const acti_name = req.body.name
    const acti_date = dateActivity
    const acti_type = req.body.type
    const acti_region = req.body.region
    const acti_desc = req.body.desc
    const acti_resource = req.body.resource
    const acti_utc = moment(date1 + "\xa0" + date2, 'YYYY-MM-DD HH:mm:ss').format()
    // const createTime = moment(req.body.createTime).format()


    const token = req.headers['authorization'].split(' ')[1]
    jwt.verify(token, config.jwtSecretKey, (error, payload) => {
        if (error) {
            return res.func('token过期，请重新登录', 401)
        }
        const username = payload.username
        const userID = payload.id

        const sqls = [
            `select CaptainID from team_test where id=? and isDelete=0`,
            `select id from team_activity where captainId=? and acti_isOnApply=1`,
            `insert into team_activity set?`
        ]
        //判断一下这个team的队长是不是用户本人
        db.query(sqls[0], teamID, (err, result) => {
            if (err) {
                return res.func(err)
            }
            if (result.length !== 1) {
                return res.func('查询球队队长id出错')
            }
            if (result.length === 1 && result[0].CaptainID !== userID) {
                return res.send('提交创建活动申请的teamID有误,你不是该球队队长', 400)
            }

            //判断用户是否已经创建了活动
            db.query(sqls[1], userID, (err1, res1) => {
                if (err1) {
                    return res.func(err1)
                }
                // console.log(res1)
                if (res1.length !== 0) {
                    return res.func('已有在创建的活动，请先取消后再申请', 400)
                }

                //已验证用户本人是提交活动申请的球队队长且还未创建活动
                const newCaptain = payload.username
                const captainID = payload.id

                db.query(sqls[2], [{
                    username,
                    userID,
                    teamName,
                    teamID,
                    newCaptain,
                    captainID,
                    acti_name,
                    acti_utc,
                    acti_date,
                    acti_type,
                    acti_region,
                    acti_desc,
                    acti_resource,
                    acti_isOnApply: 1,
                    // createTime
                }], (err2, res2) => {
                    if (err2) {
                        return res.func(err2)
                    }
                    // console.log(res1)
                    if (res2.affectedRows !== 1) {
                        return res.func('申请活动失败，请重试', 400)
                    }
                    res.send({
                        status:200,
                        message:'球队活动或赛事创建成功',
                        ActiData:req.body
                    })
                })
            })
        })
    })
}

function getActivity (req, res) {
    // res.func('收到获取申请',0)
    // console.log(req.body)
    db.query(`select 1`, (err, result) => {
        if (err) {
            return res.func('连接数据库失败')
        }
    })

    const sql = `select * from team_activity where acti_isOnApply=1`
    db.query(sql, (error, result) => {

        if (error) {
            return res.func(error)
        }
        // console.log(result)
        if(result.length ===0){
           return res.send({
                status: 201,
                message: '无任何活动信息',
                ActiData:[]
            })
        }
        res.send({
            status: 200,
            message: '获取活动列表成功',
            ActiData: result
        })
    })
}

function deleteActivity (req, res) {
    // res.func('收到删除申请',200)
    // console.log(req.body)
    db.query(`select 1`, (err, result) => {
        if (err) {
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }

    })

    const token = req.headers['authorization'].split(' ')[1]
    const acti_id = req.body.acti_id
    // const updateTime = moment(req.body.updateTime).format()
    // const userID = req.body.userID
    // console.log(token)
    jwt.verify(token, config.jwtSecretKey, (error, payload) => {
        if (error) {
            return res.func('token过期，请重新登录', 401)
        }

        /*检查所传acti_id是否与用户本人所管理的acti_id相匹配*/
        const userID = payload.id
        const sqls = [
            `select id from team_activity where captainID=? and acti_isOnApply=1`,
            `update team_activity set acti_isOnApply=? where id=? and captainID=?`
        ]
        db.query(sqls[0], userID, (err, result) => {
            // console.log(result)
            if (err) {
                return res.func(err)
            }
            if (result.length === 1 && result[0].id === acti_id) {
                db.query(sqls[1], [0,acti_id, userID], (err1, res1) => {
                    if (err1) {
                        return res.func(err1)
                    }
                    if (res1.affectedRows !== 1) {
                        return res.func('删除球队活动失败，请重试', 400)
                    }
                    res.func('删除球队活动成功', 200)
                })
                return true
            }
            res.func('所提交活动ID不符合', 400)
        })
    })
}


module.exports = {
    createActivity,
    getActivity,
    deleteActivity
}
