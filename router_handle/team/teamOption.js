const db = require('../../db/db')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const fs = require('fs')
const cosUpload = require('../../API/Cos_Cloud') /*腾讯云图床*/
const moment = require("moment");

/*搜索球队*/
function teamSearch (req, res) {

    db.query(`select 1`, (err, result) => {
        if (err) {
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })

    const sql = `select id,teamName from team_test where isDelete=0`
    db.query(sql, (err, result) => {
        if (err) res.func(err)
        // console.log(result)
        res.send({
            status: 200,
            message: '获取球队列表成功',
            teamList: result
        })
    })
}

/*加入球队*/
function teamJoin (req, res) {
    // res.func('加入球队申请成功',0)
    // console.log(req.body)
    const token = req.headers['authorization'].split(' ')[1]
    const teamID = req.body.teamID
    const teamName = req.body.teamName
    const createTime = moment(req.body.createTime).format()
    if (token !== '' && teamID !== '' && teamName !== '') {
        db.query(`select 1`, (err, result) => {
            if (err) {
                return res.func('连接数据库失败')
                // console.log(err.message + '链接数据库失败')
            }
        })

        jwt.verify(token, config.jwtSecretKey, (error, payload) => {
            if (error) {
                return res.func('提交的ID信息已过期，请重新登录后再申请', 401)
            }

            const userID = payload.id
            const username = payload.username
            /* ``````````````
            //todo =>此处要添加个判断看看是否已存在 用户 加入球队申请√
            ````````````````*/
            const sqls = [
                'select teamID from users_test where id=? and isDelete=0',
                'select id from userjointeam where userID=? and joinStatusYes=1',
                'insert into userjointeam(userID,username,teamID,teamName,joinStatusYes,createTime) values(?,?,?,?,?,?)'
            ]
            //判断是否加入了球队
            db.query(sqls[0], userID, (err, result) => {
                if (err) {
                    return res.func(err)
                }
                console.log(result)
                if (result[0].teamID !== null) {
                    return res.func('你已经加入球队，不要乱申请喔', 400)
                }
                //是否在申请加入球队中
                db.query(sqls[1], userID, (err1, res1) => {
                    if (err1) {
                        return res.func(err1)
                    }
                    if (res1.length !== 0) {
                        return res.func('你已经申请加入其他球队，不能重复申请', 400)
                    }
                    //加入球队成功
                    db.query(sqls[2], [userID, username, teamID, teamName, 1,createTime], (err2, res2) => {
                        if (err2) {
                            return res.func(err2)
                        }
                        if (res2.affectedRows !== 1) {
                            return res.func('申请加入球队失败,请重试', 400)
                        }
                        res.func('加入球队申请成功', 200)
                    })
                })
            })
        })
    }
}

/*查看球队加入申请状态*/
function teamJoinStatus (req, res) {
    // res.func('刷新页面查看申请状态',0)
    // console.log(req.body)

    db.query(`select 1`, (err, result) => {
        if (err) {
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })

    const token = req.headers['authorization'].split(' ')[1]
    jwt.verify(token, config.jwtSecretKey, (error, payload) => {
        if (error) {
            return res.func('提交的ID信息已过期，请重新登录后再申请', 401)
        }

        const userID = payload.id
        const sql = `select teamID,teamName,joinStatusYes from userJoinTeam where userID=? and joinStatusYes=?`
        db.query(sql, [userID, 1], (err, result) => {
            if (err) {
                return res.func(err)
            }
            // console.log(result)
            if (result.length === 0) {
                return res.send({
                    status: 201,
                    message: '未加入任何球队'
                })
            }
            if (result.length === 1) {
                // console.log(result)
                // if (result[0].joinStatusYes === 1){
                const teamName = result[0].teamName
                const teamID = result[0].teamID
                return res.send({
                    status: 200,
                    message: '球队加入申请中',
                    joinData: {
                        teamName,
                        teamID
                    }
                })
            }
            res.func('系统检测到球队申请数据有误', 400)
        })
    })

}

/*撤销球队加入申请*/
function deleteTeamJoin (req, res) {
    // res.func('已收到撤销申请',0)
    // console.log(req.body.userID)
    // const userID = req.body.userID
    // console.log(userID)
    db.query(`select 1`, (err, result) => {
        if (err) {
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })

    /*TODO => 此处sql语句可能要改为 delete ×*/

    const token = req.headers['authorization'].split(' ')[1]
    jwt.verify(token, config.jwtSecretKey, (error, payload) => {
        // console.log(result)
        if (error) {
            return res.func('提交的ID信息已过期，请重新登录后再申请', 401)
        }
        const userID = payload.id
        const updateTime = moment(req.body.updateTime).format()
        const sql = `update  userJoinTeam set joinStatusYes=?,updateTime=? where userID=? and joinStatusYes=1`
        db.query(sql, [0, updateTime,userID], (err, result) => {
            if (err) {
                return res.func(err.message)
            }
            // console.log(result)
            if (result.affectedRows !== 1) {
                return res.func('撤销加入球队申请失败，请重试', 400)
            }
            res.func('撤销加入球队申请成功', 200)
        })
    })
}

/*创建球队*/
function teamCreate (req, res) {
    // console.log(req.body)
    db.query(`select 1`, (err, result) => {
        if (err) {
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })

    const token = req.headers['authorization'].split(' ')[1]
    jwt.verify(token, config.jwtSecretKey, (error, payload) => {
        if (error) {
            return res.func('token过期，请重新登录', 401)
        }
        const userID = payload.id
        const username = payload.username

        const sqls = [
            'select teamID from users_test where id=?',
            'select id from userjointeam where userID=? and joinStatusYes=1',
            `select id from team_test where teamName=? and isDelete=0`,
            `insert into team_test set?`,
            `update users_test set teamID=? where id=? and isDelete=0`,
            `update team_test set fkID=? where id=? and isDelete=0`,
        ]
        //验证用户是否加入了球队
        db.query(sqls[0], userID, (err, result) => {
            if (err) { return res.func(err) }
            console.log(result)
            if (result[0].teamID !== null) { return res.func('你已经加入球队，不能创建球队', 400) }
            //是否在申请加入球队中
            db.query(sqls[1], userID, (err1, res1) => {
                if (err1) { return res.func(err1) }
                if (res1.length !== 0) { return res.func('你已经申请加入其他球队，不能创建球队', 400) }
            //验证通过用户可以创建球队
                const teamSlogan = req.body.teamSlogan
                const teamDesc = req.body.teamDesc
                const teamName = req.body.teamName
                const createTime = moment(req.body.updateTime).format()

                if (!teamName) { return res.func('球队名不能为空') }
                db.query(sqls[2],teamName,(err2,res2)=>{
                    if (err2) { return res.func(err2) }
                    if (res2.length > 0) { return res.func('球队名已经被注册') }

                    db.query(sqls[3],{ teamName, userID, username, teamSlogan, teamDesc, CaptainID: userID, newCaptain: username, teamPic: '', isDelete: 0,createTime },(err3,res3)=>{
                        if (err3) { return res.func(err3) }
                        // console.log(res3)
                        const insertId = res3.insertId
                        db.query(sqls[4],[insertId,userID],(err4,res4)=>{
                            if (err4) { return res.func(err4) }
                            if (res4.affectedRows !==1) { return  res.func('球队已创建，但更新球员表teamID失败') }

                            db.query(sqls[5],[insertId,insertId],(err5,res5)=>{
                                if (err5) { return res.func(err5) }
                                if (res5.affectedRows !==1) { return res.func('球队已创建，但更新fkID失败') }
                                res.send({
                                    status: 200,
                                    message: '创建球队成功',
                                    teamID: insertId
                                })
                            })
                        })
                    })
                })
            })
        })
    })

}

/*设置球队图片*/
function teamSetPic (req, res) {
    if (!req.file) {
        return res.func('你没有添加图片，别乱搞', 404)
    }
    console.log(req.file)
    const type = req.file.mimetype.split('/')[1]
    const teamID = req.file.originalname
    const oldPicName = req.file.path
    let Key, newPicName
    if (type === 'png') {
        Key = '10551/teamPic/' + teamID + '.png'
        newPicName = req.file.path + '.png'
    } else {
        Key = '10551/teamPic/' + teamID + '.jpg'
        newPicName = req.file.path + ".jpg"
    }
    fs.renameSync(oldPicName, newPicName)
    // console.log(newPicName)
    db.query('select 1', (error, result) => {
        if (error) return res.func('数据库链接失败')
    })

    const token = req.headers['authorization'].split(' ')[1]
    jwt.verify(token, config.jwtSecretKey, (error, payload) => {
        if (error) return res.func('token过期，请重新登录', 401)

        const userID = payload.id
        //验证是否 用户是否为所提交teamID的队长
        const sqls = [
            `select CaptainID from team_test where id=? and isDelete=0`,
            `update team_test set teamPic=? where CaptainID=? and id=?`
        ]
        db.query(sqls[0], teamID, (err, result) => {
            if (err) {
                return res.func(err)
            }
            if (result.length !== 1) {
                return res.func('球队队长ID匹配有误')
            }
            if (result.length === 1 && result[0].CaptainID !== userID) {
                return res.func('你不是该球队队长，不能修改图片', 400)
            }

            cosUpload(newPicName, Key).then(obj => {
                // console.log(obj)
                if (obj.statusCode === 200) {
                    //删除本地图片
                    fs.unlink(newPicName, function (error) {
                        if (error) { throw error }
                        // console.log('本地文件:' + newPicName + '删除成功！');
                    })
                    const userPic = obj.location
                    db.query(sqls[1], [userPic, userID, teamID], (err1, res1) => {
                        if (err1) {
                            return res.func(err1)
                        }
                        // console.log(res1)
                        if (res1.affectedRows !== 1) {
                            return res.func('数据库插入头像地址失败', 400)
                        }
                        res.func('球队头像上传成功', 200)
                    })
                } else {
                    res.func('球队头像存储失败，请重试', 400)
                }
            })
        })
    })
}

/*退出球队*/
function teamQuit (req, res) {
    // console.log(req.body)
    db.query(`select 1`, (err, result) => {
        if (err) {
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })
    const token = req.headers['authorization'].split(' ')[1]
    const teamID = req.body.teamID

    function capUpdate (query, array) {
        db.query(query, array, (err, result) => {
            if (err) {
                return res.func(err)
            }
            if (result.affectedRows !== 1) {
                return res.func('更新球队队长失败，请重试', 400)
            }
        })
        return -1
    }

    function userUpdate (query, array) {
        db.query(query, array, (err, result) => {
            if (err) {
                res.func(err)
            }
            if (result.affectedRows !== 1) {
                return res.func('退出球队失败，请重试', 400)
            }
        })
        return -1
    }

    jwt.verify(token, config.jwtSecretKey, (error, payload) => {
        if (error) {
            return res.func('token过期，请重新登录', 401)
        }
        const userID = payload.id
        if (req.body.newCaptain !== '') {
            /*指定了新队长*/
            const sqls = [
                `select CaptainID from team_test where id=?`,
                `select captainID from team_activity where teamID=? and acti_isOnApply=1`,
                `update team_activity set newCaptain=?,captainID=? where teamID=? and acti_isOnApply=1`,
                `update team_test set newCaptain=?,CaptainID=? where id=?`,
                `update users_test set teamID=? where id=? and isDelete=0`
            ]

            //验证用户本人是否为该球队队长 和 是否创建了活动
            db.query(sqls[0], teamID, (err, result) => {
                if (err) {
                    return res.func(err)
                }
                if (result.length !== 1) {
                    return res.func('查询队长信息失败')
                }
                if (result.length === 1 && result[0].CaptainID !== userID) {
                    return res.send('用户信息与球队队长信息冲突', 400)
                }
                /*检查是否创建了活动*/
                db.query(sqls[1], teamID, (err1, res1) => {
                    // console.log(res3)
                    if (err1) {
                        return res.func(err1)
                    }
                    if (res1.length > 1) {
                        return res.func('在核对球队活动信息时出错')
                    }
                    if (res1.length === 1 && res1[0].captainID !== userID) {
                        return res.func('在核对球队活动信息时出错')
                    }
                    if (res1.length === 1 && res1[0].captainID === userID) {
                        // return  res.func('这个活动的管理权限者不是你',400)
                        //更新球队活动管理权限给新队长
                        const newCaptain = req.body.newCaptain.username
                        const CaptainID = req.body.newCaptain.id
                        const capArr = [newCaptain, CaptainID, teamID]

                        db.query(sqls[2], capArr, (err2, res2) => {
                            if (err2) {
                                return res.func(err2)
                            }
                            if (res2.affectedRows !== 1) {
                                return res.func('处理球队活动权限时发生错误', 400)
                            }
                            // return res.func('球队活动管理权限成功更新',200)
                            //更新球队队长信息
                            if (capUpdate(sqls[3], capArr)) {
                                // 删除用户所在球队teamID
                                const userArr = [null, userID]
                                if (userUpdate(sqls[4], userArr)) {
                                    res.func('队长退出球队申请成功', 200)
                                }
                            }
                        })
                    }
                    //验证通过,用户是队长且没有创建活动
                    if (capUpdate(sqls[3], [req.body.newCaptain.username, req.body.newCaptain.id, req.body.teamID])) {
                        if (userUpdate(sqls[4], [null, userID])) {
                            res.func('队长退出球队申请完成', 200)
                        }
                    }
                })
            })

            //更新球队队长信息
            // db.query(sqls[3], [{ newCaptain, CaptainID }, teamID], (err, result) => {
            //     if ( err ) {
            //         return res.func(err)
            //     }
            //     // console.log(result1)
            //     if ( result.affectedRows !== 1 ) {
            //         return res.func('更新球队队长失败，请重试')
            //     }
            // })

            //删除用户所在球队teamID
            // db.query(sqls[4], [{ teamID: null }, userID, teamID], (err, result) => {
            //     if ( err ) {
            //         return res.func(err)
            //     }
            //     if ( result.affectedRows !== 1 ) {
            //         return res.func('退出球队失败，请重试')
            //     }
            //     // console.log(result)
            //     res.func('队长退出球队申请完成', 200)
            // })
        } else {
            const sql = `update users_test set teamID=? where id=? and isDelete=0`
            db.query(sql, [null, userID], (err, result) => {
                if (err) return res.func(err)
                if (result.affectedRows !== 1) {
                    return res.func('队员退出球队失败，请重试', 400)
                }
                res.func('您退出球队申请完成', 200)
            })
        }
    })
}

/*更改球队资料*/
function teamInfoSet (req, res) {
    // console.log(req.body)
    // res.func('收到修改球队信息',200)
    db.query('select 1', (error, result) => {
        if (error) return res.func('数据库链接失败')
    })
    const token = req.headers['authorization'].split(' ')[1]
    const teamSlogan = req.body.teamSlogan
    const teamDesc = req.body.teamDesc
    const teamID = req.body.teamID
    const updateTime = moment(req.body.updateTime).format()
    jwt.verify(token, config.jwtSecretKey, (error, payload) => {
        if (error) {
            return res.func('token过期，请重新登录', 401)
        }

        const userID = payload.id
        const sqls = [
            `select CaptainID from team_test where id=? and isDelete=0`,
            `update team_test set teamSlogan=?,teamDesc=?,updateTime=?  where id=?`
        ]

        if (teamSlogan !== '' || teamDesc !== '') {
            db.query(sqls[0], teamID, (err, result) => {
                if (err) {
                    return res.func(err)
                }
                if (result.length !== 1) {
                    return res.func('球队队长ID匹配有误')
                }
                if (result.length === 1 && result[0].CaptainID !== userID) {
                    return res.func('你不是该球队队长，不能修改图片', 400)
                }
                db.query(sqls[1], [teamSlogan,teamDesc,updateTime,teamID], (err1, res1) => {
                    if (err1) { return res.func(err1) }
                    // console.log(res1)
                    if (res1.affectedRows !== 1) { return res.func('更新球队资料失败', 400) }
                    res.func('更新球队资料成功', 200)
                })
            })
        } else {
            res.func('资料无改动', 200)
        }
    })
}

/*删除球队*/
function teamDelete (req, res) {
    // console.log(req.body)
    // res.func('收到删除申请',200)
    db.query('select 1', (error, result) => {
        if (error) return res.func('数据库链接失败')
    })
    const token = req.headers['authorization'].split(' ')[1]
    // console.log(token)
    jwt.verify(token, config.jwtSecretKey, (error, payload) => {
        if (error) {
            return res.func('token过期，请重新登录', 401)
        }
        // console.log(payload)
        const userID = payload.id
        const teamID = req.body.teamID
        const deleteTime = moment(req.body.deleteTime).format()

        const sqls = [
            `select CaptainID from team_test where id=? and isDelete=0`,
            `select id from team_activity where captainID=? and teamID=? and acti_isOnApply=1`,
            `update team_test set isDelete=?,deleteTime=? where id=? and CaptainID=?`,
            `update users_test set teamID=? where id=? and isDelete=0`
        ]

        //判断要删除的球队的队长是否为用户本人
        db.query(sqls[0], teamID, (err, result) => {
            if (err) { return res.func(err) }
            if (result.length !== 1) { return res.func('查询球队队长id出错') }
            if (result.length === 1 && result[0].CaptainID !== userID) {
                return res.send({
                    status: 400,
                    message: '提交删除申请的teamID有误'
                })
            }

            //判断是否有活动
            db.query(sqls[1], [userID, teamID], (err1, res1) => {
                if (err1) { return res.func(err1) }
                if (res1.length === 1) { return res.func('球队仍有活动未处理,请处理后再执行此操作', 400) }
                if (res1.length > 1) { return res.func('用户与球队活动数据有误', 400) }

                db.query(sqls[2], [1,deleteTime,teamID, userID], (err2, res2) => {
                    if (err2) { return res.func(err2) }
                    if (res2.affectedRows !== 1) { return res.func('更新球队delete信息出错') }

                    db.query(sqls[3], [null, userID], (err3, res3) => {
                        if (err3) { return res.func(err3) }
                        if (res3.affectedRows !== 1) { res.func('更新用户球队ID出错') }
                        res.send({
                            status: 200,
                            message: '删除球队成功'
                        })
                    })
                })
            })
        })
    })
}

module.exports = {
    teamSearch,
    teamJoin,
    teamJoinStatus,
    deleteTeamJoin,
    teamCreate,
    teamQuit,
    teamSetPic,
    teamInfoSet,
    teamDelete
}
