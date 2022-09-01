const db = require('../db/db')
const jwt = require('jsonwebtoken')
const config = require('../config')
const moment = require('moment')


function switchRes(newDate)  {
        switch (newDate) {
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

function createTeamActivity  (req, res) {
    // res.send('创建活动成功')
    console.log(req.body)

    db.query(`select 1`,(err,result)=>{
        if(err){
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })
    const date2 = moment(req.body.date2).utc(8).format('HH:mm:ss')
    const date1 = moment(req.body.date1).utc(8).format('YYYY-MM-DD')
    // console.log('date1:'+date1)
    // console.log('date2:'+date2)
    const weekDate =  moment(req.body.date1).day()
    const week = switchRes(weekDate)
    const dateActivity = date1 + "\xa0" + week + "\xa0" +  date2

    const teamName  = req.body.teamName
    const teamID = req.body.teamID
    const acti_name = req.body.name
    const acti_date = dateActivity
    const acti_type = req.body.type
    const acti_region = req.body.region
    const acti_desc = req.body.desc
    const acti_resource = req.body.resource
    const acti_utc = moment(date1 + "\xa0" + date2,'YYYY-MM-DD HH:mm:ss').format()
    // console.log(typeof acti_utc)
    const token = req.headers['authorization'].split(' ')[1]

    jwt.verify(token,config.jwtSecretKey,(err,payload)=>{
        if(err){return res.func('token过期，请重新登录',401)}
        // console.log(payload)
        const username = payload.username
        const userID = payload.id
        const sqliIns = `insert into team_activity set?`

        db.query(sqliIns,[{username,userID,teamName,teamID,acti_name,acti_utc,acti_date,acti_type,acti_region, acti_desc,acti_resource,acti_isOnApply:1}],(err1,res1)=>{
            if(err1) {return res.func(err1)}
            // console.log(res1)
            if(res1.affectedRows !==1){return res.func('申请活动失败，请重试')}
            res.func('申请成功',200)
        })
    })
}

function getTeamActivity (req,res) {
    // res.func('收到获取申请',0)
    // console.log(req.body)
    db.query(`select 1`,(err,result)=>{
        if(err){
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })
    // const token = req.headers['authorization'].split(' ')[1]
    // jwt.verify(token,config.jwtSecretKey,(err,payload)=>{
    //     if(err){return res.func(err)}
        // console.log(payload)
        // const userID = payload.id
        // const teamID = payload.teamID
        // const sql = `select id,userID,teamID,acti_name,acti_utc,acti_date,acti_type,acti_region,acti_desc,acti_resource,acti_isOnApply from team_activity`
        const sql = `select * from team_activity where acti_isOnApply=1`
        db.query(sql,(err1,res1)=>{
            // console.log(res1)
            // if (res1.length === 0){
            //     // return
            //     res.send({
            //         ActiData:[]
            //     })
            // }
            if (err1) {return res.func(err1)}
            // console.log(res1)
            // if (res1.length !==1){
            //     res.func('查询失败，请稍后再试',400)
            // }
            const ActiData = res1
            res.send({
                status:200,
                message:'获取活动列表成功',
                ActiData
            })
        })
    // })
}

function deleteActivity (req,res){
    // res.func('收到删除申请',200)
    console.log(req.body)
    db.query(`select 1`,(err,result)=>{
        if(err){
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }

    })
        const token = req.headers['authorization'].split(' ')[1]
        const acti_id = req.body.acti_id
        const userID = req.body.userID
        // console.log(token)
        jwt.verify(token, config.jwtSecretKey, (error, payload) => {
            if (error) {
                return res.func('token过期，请重新登录',401)
            }
            // console.log("111")
                const sql = `update team_activity set? where id=? and userID=?`
                db.query(sql, [{acti_isOnApply:0},acti_id, userID], (err1, res1) => {

                    if (err1) {
                        return res.func(err1)
                    }
                    // console.log(res1)
                    console.log(res1.affectedRows)
                    if (res1.affectedRows !== 1) {
                         res.func('删除失败，请重试', 400)
                    }else {
                        res.func('删除成功', 200)
                    }
                })
        })
}

module.exports = {
    createTeamActivity,
    getTeamActivity,
    deleteActivity
}
