const db = require('../db/db')
const jwt = require('jsonwebtoken')
const config = require('../config')
const fs = require('fs')
const cosUpload = require('../API/Cos_Cloud')

function teamSearch (req,res){

    db.query(`select 1`,(err,result)=>{
        if(err){
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })

    const sql = `select id,teamName from team_test where isDelete=0`
    db.query(sql,(err,result)=>{
        if (err) res.func(err)
        // console.log(result)
        res.send({
            status:200,
            message:'获取球队列表成功',
            teamList:result
        })
    })
}

function teamJoin  (req, res){
    // res.func('加入球队申请成功',0)
    // console.log(req.body)
    const token = req.headers['authorization'].split(' ')[1]
    const teamID = req.body.teamID
    const teamName = req.body.teamName

    if(token !== '' && teamID !=='' && teamName !==''){
        db.query(`select 1`,(err,result)=>{
            if(err){
                return res.func('连接数据库失败')
                // console.log(err.message + '链接数据库失败')
            }
        })
        // console.log({userID,teamID,teamName})
        jwt.verify(token,config.jwtSecretKey,(err,result)=>{
            // console.log(result)
            if(err) {return res.func('提交的ID信息已过期，请重新登录后再申请',401)}
            const userID = result.id
            const username = result.username

/*            ``````````````
            //todo =>此处要添加个判断看看是否已存在ID √
            ````````````````*/
            const sql = `select id from userjointeam where userID=? and joinStatusYes=1`
            db.query(sql,userID,(err2,res2)=>{
                if (err2) {
                    return res.func(err2)
                }
                if (res2.length !==0){
                    return res.func('加入球队失败，系统检测到数据有误',400)
                }
                const sqlInt = `insert into userJoinTeam set? `
                db.query(sqlInt,[{
                    userID,username,teamID,teamName,joinStatusYes:1
                }],(err1,result1)=>{
                    if(err1) {return res.func(err)}
                    // console.log(result1)
                    if (result1.affectedRows !==1){
                        return res.func('申请加入球队失败',400)
                    }
                    res.func('加入球队申请成功',200)
                })
            })
        })
    }
}

function teamJoinStatus (req,res){
    // res.func('刷新页面查看申请状态',0)
    // console.log(req.body)

    db.query(`select 1`,(err,result)=>{
        if(err){
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })
    const token = req.headers['authorization'].split(' ')[1]
    jwt.verify(token,config.jwtSecretKey,(errJWT,payload)=>{
        if(errJWT) {
            return res.func('提交的ID信息已过期，请重新登录后再申请',401)
        }
        const userID = payload.id
        const sqlSel = `select teamID,teamName,joinStatusYes from userJoinTeam where userID=? and joinStatusYes=?`
        db.query(sqlSel,[userID,1],(err,result)=>{
            if (err){
                return res.func(err)
            }
            // console.log(result)
            if(result.length === 0){
                return  res.send({
                    status:201,
                    message:'未加入任何球队'
                })
            }
            if( result.length === 1){
                // console.log(result)
                // if (result[0].joinStatusYes === 1){
                    const teamName = result[0].teamName
                    const teamID = result[0].teamID
                    return  res.send({
                        status:200,
                        message:'球队加入申请中',
                        joinData:{
                            joinStatus:1,
                            teamName,
                            teamID
                        }
                    })
                }
            res.func('系统检测到球队申请数据有误',400)
        })
    })

}

function deleteJoinStatus(req,res){
    // res.func('已收到撤销申请',0)
    // console.log(req.body.userID)
    // const userID = req.body.userID
    // console.log(userID)
    db.query(`select 1`,(err,result)=>{
        if(err){
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })

    /*TODO => 此处sql语句可能要改为 delete √*/
    const token = req.headers['authorization'].split(' ')[1]
    jwt.verify(token,config.jwtSecretKey,(err1,payload)=> {
        const userID = payload.id
        // console.log(result)
        if (err1) {
            return res.func('提交的ID信息已过期，请重新登录后再申请', 401)
        }

        const sql = `update  userJoinTeam set? where userID=? and joinStatusYes=1`
        db.query(sql, [{joinStatusYes: 0}, userID], (err, result) => {
            if (err) {
                return res.func(err.message)
            }
            // console.log(result)
            if (result.affectedRows !== 1) {
                return res.func('撤销加入球队申请失败，请重试', 400)
            }
            res.func('撤销申请成功', 200)
        })
    })
}

function teamCreate (req,res)  {

    console.log(req.body)

    db.query(`select 1`,(err,result)=>{
        if(err){
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })

    const token = req.headers['authorization'].split(' ')[1]
    jwt.verify(token, config.jwtSecretKey, (err1, payload) => {
        if (err1) {
            return res.func('token过期，请重新登录',401)
        }
        const teamSlogan = req.body.teamSlogan
        const teamDesc = req.body.teamDesc
        const teamName = req.body.teamName

        if (!teamName) { return res.func('球队名不能为空') }

        const sqlCre = `select * from team_test where teamName=?`
        db.query(sqlCre,teamName,(err,result)=> {
            if (err) {
                return res.func(err.message)
            }
            // console.log(result)
            if (result.length > 0) {
                return res.func('球队名已经被注册')
            }

            const userID = payload.id
            const username = payload.username

            const sqlIns = `insert into team_test set?`
            db.query(sqlIns,{teamName,userID,username,teamSlogan,teamDesc,CaptainID:userID,newCaptain:username,teamPic:'',isDelete:0},(err,result)=>{
                if (err) {return res.func(err)}
                const insertId = result.insertId
                const sqlUpt1 = `update team_test set? where id=? and isDelete=0`
                const sqlUpt2 = `update users_test set? where id=? and isDelete=0`
                db.query(sqlUpt1,[{fkID:insertId},insertId],(err1,result1)=>{
                    if (err1) return res.func(err1)
                    db.query(sqlUpt2,[{teamID:insertId},userID],(err2,result2)=>{
                        if(err2) return res.func(err2)
                        res.func('创建球队成功',0)
                    })
                })
            })
        })
    })

}

function teamSetPic (req,res) {
    if (!req.file) { return res.func('别乱搞',404)}

    db.query('select 1',(error,result)=>{
        if ( error ) return res.func('数据库链接失败')
    })

    const oldPicName = req.file.path
    const newPicName = req.file.path +".jpg"
    fs.renameSync(oldPicName,newPicName)
    // console.log(newPicName)

    const token = req.headers['authorization'].split(' ')[1]

    jwt.verify(token, config.jwtSecretKey,(jwtErr,payload)=>{
        if (jwtErr) return res.func('token过期，请重新登录',401)

        const userID = payload.id

        const sqlSel = `select teamName,id from team_test where CaptainID=? and isDelete=0`

        db.query(sqlSel,userID,(err1,res1)=>{

            if (err1) {
                return res.func(err1,200)
            }

            console.log(res1)

            if (res1.length !==1){
                return  res.func('你不是球队队长，不能修改球队资料',400)
            }

            const teamID = res1[0].id
            const key = '10551/teamPic/' + teamID + '.jpg'

            cosUpload(newPicName,key).then(obj=>{
                console.log(obj)
                if (obj.statusCode === 200){

                    const userPic = obj.location

                    const sqlIns = `update team_test set teamPic=? where CaptainID=? and id=?`

                    db.query(sqlIns,[userPic,userID,teamID],(err2,res2)=>{
                        if (err2) { return res.func(err2)}
                        // console.log(res2)
                        if (res2.affectedRows !==1){
                            return  res.func('数据库插入头像地址失败',400)
                        }
                        res.func('球队头像上传成功',200)
                    })
                }else {
                    res.func('球队头像存储失败，请重试',404)
                }
            })
        })
    })
}

function teamQuit (req,res) {

    // console.log(req.body)

    db.query(`select 1`,(err,result)=>{
        if(err){
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })
    const token = req.headers['authorization'].split(' ')[1]
    const teamID = req.body.teamID
    jwt.verify(token, config.jwtSecretKey,(jwtErr,payload)=> {
        if (jwtErr) {
            return res.func('token过期，请重新登录', 401)
        }
        const userID = payload.id
        // res.func('队员退出球队申请完成',200)
        if (req.body.newCaptain !=='') {

            //指定了新队长
            const SqlTest = `select CaptainID from team_test where id=?`
            db.query(SqlTest,teamID,(err3,res3)=>{
                if (err3) {
                    return res.func(err3)
                }
                if (res3.length!==1){
                    return res.func('查询队长信息失败')
                }
                if (res3.length ===1 && res3[0].CaptainID !== userID){
                    return res.send({
                        status:400,
                        message:'用户信息与球队队长信息冲突'
                    })
                }

                const newCaptain = req.body.newCaptain.username
                const CaptainID = req.body.newCaptain.id
                const sqlUpt1 = `update team_test set? where ID=?`

                //检查是否创建了活动
                const sql1 = `select captainID from team_activity where teamID=? and acti_isOnApply=1`
                db.query(sql1,teamID,(err3,res3)=>{
                    // console.log(res3)
                    if (err3) {
                        return res.func(err3)
                    }
                    if(res3.length > 1) {
                        return res.func('在核对球队活动信息时出错')
                    }
                    if (res3.lenth === 1 && res3[0].captainID !== userID){
                        return res.func('在核对球队活动信息时出错')
                    }
                    if (res3.length ===1 && res3[0].captainID === userID){
                        // return  res.func('这个活动的管理权限者不是你',400)
                        const sql2 = `update team_activity set? where teamID=? and acti_isOnApply=1`
                        db.query(sql2,[{newCaptain, CaptainID}, teamID],(err4,res4)=>{
                            if (err4) {
                                return res.func(err4)
                            }
                            if (res4.affectedRows !==1) {
                                return res.func('处理球队活动权限时发生错误',400)
                            }
                           // return res.func('球队活动管理权限成功更新',200)
                        })
                    }
                })
                db.query(sqlUpt1, [{newCaptain, CaptainID}, teamID], (err1, result1) => {
                    if (err1) return res.func(err1)
                    // console.log(result1)
                    if (result1.affectedRows !== 1) {
                        return res.func('更新球队队长失败，请重试')
                    }
                    const sqlUpt = `update users_test set? where ID=? and teamID=?`
                    db.query(sqlUpt, [{teamID: null}, userID, teamID], (err, result) => {
                        if (err) return res.func(err)
                        if (result.affectedRows !== 1) {
                            return res.func('退出球队失败，请重试')
                        }
                        // console.log(result)
                        res.func('队长退出球队申请完成', 200)
                    })
                })
            })


        } else {
            const sqlUpt = `update users_test set? where id=? and isDelete=0`
            db.query(sqlUpt, [{teamID: null}, userID], (err2, result2) => {
                if (err2) return res.func(err2)
                // console.log('result2')
                if (result2.affectedRows !== 1) {
                    return res.func('球员退出球队失败，请重试')
                }// console.log(result)
                res.func('您退出球队申请完成', 200)
            })
        }
    })
}

function teamInfoSet (req,res) {
    console.log(req.body)
    // res.func('收到修改球队信息',200)
    db.query('select 1',(error,result)=>{
        if ( error ) return res.func('数据库链接失败')
    })
    const token = req.headers['authorization'].split(' ')[1]
    const teamSlogan = req.body.teamSlogan
    const teamDesc = req.body.teamDesc
    const teamID = req.body.teamID
    // console.log('teamSlogan的值是' + teamSlogan)
    // console.log(token)
    jwt.verify(token, config.jwtSecretKey, (err, payload) => {
        if (err) {
            return res.func('token过期，请重新登录', 401)
        }
        if (teamSlogan !== '' || teamDesc !==''){
            const sql = `update team_test set? where id=?`
            db.query(sql,[{teamSlogan,teamDesc},teamID],(err1,res1)=>{
                if (err1) {
                    return res.func(err1)
                }
                // console.log(res1)
                if (res1.affectedRows !==1){
                    return  res.func('更新球队资料失败',400)
                }
                res.func('更新球队资料成功',200)
            })
        }else {
            res.func('资料无改动',200)
        }
    })
}

function teamPicSet (req,res) {
    console.log(req.file)
    // console.log(req.)
    // res.func('收到修改球队头像申请',200)
    db.query('select 1',(error,result)=>{
        if ( error ) return res.func('数据库链接失败')
    })
    const token = req.headers['authorization'].split(' ')[1]
    const type = req.file.mimetype.split('/')[1]
    const teamID = req.file.originalname
    // console.log(teamID)
    jwt.verify(token,config.jwtSecretKey,(err1,payload)=>{
        if (err1) {
            return res.func('token过期，请重新登录', 401)
        }
        const oldPicname = req.file.path
        // console.log(oldPicname)
        // console.log(type)
        let Key,newPicname
        if (type === 'png'){
            Key = '10551/teamPic/'+ teamID + '.png'
            newPicname =  req.file.path +'.png'
        }else{
            Key = '10551/teamPic/'+ teamID + '.jpg'
            newPicname =  req.file.path +".jpg"
        }
        fs.renameSync(oldPicname,newPicname)
        // console.log(newPicname)

        cosUpload(newPicname,Key).then(obj=>{
            // console.log(obj)
            if (obj.statusCode === 200){
                fs.unlink(newPicname, function(err2){
                    if(err2){
                        throw err2;
                    }
                    console.log('本地文件:'+newPicname+'删除成功！')
                })
                const teamPic = obj.location
                const sqlUpt = `update team_test set teamPic=? where id=?`
                db.query(sqlUpt,[teamPic,teamID],(err,result)=>{
                    if ( err ) return res.func(err)
                    // console.log(result)
                    if ( result.affectedRows !==1 ) return res.func('数据库插入头像地址失败',400)
                    res.send({
                        status:200,
                        message:'更新头像成功'
                    })
                })
            }else {
                res.func('存储失败',404)
            }
        })
    })

}

function teamDelete (req,res){
    // console.log(req.body)
    // res.func('收到删除申请',200)

    db.query('select 1',(error,result)=>{
        if ( error ) return res.func('数据库链接失败')
    })
    const token = req.headers['authorization'].split(' ')[1]
    // console.log(token)
    jwt.verify(token,config.jwtSecretKey,(err,payload)=>{
        if (err) {
            return res.func('token过期，请重新登录', 401)
        }
        // console.log(payload)
        const userID = payload.id
        const teamID = req.body.teamID
        const sql = `select CaptainID from team_test where id=? and isDelete=0`
        db.query(sql,teamID,(err1,res1)=>{
            if (err1) {
                return res.func(err1)
            }
            if (res1.length!==1){
                return  res.func('查询球队队长id出错')
            }
            if (res1.length ===1 && res1[0].CaptainID !== userID ) {
                return  res.send ({
                    status:400,
                    message:'提交删除申请的teamID有误'
                })
            }

            const sql2 = `update team_test set? where id=? and CaptainID=?`
            db.query(sql2,[{isDelete:1},teamID,userID],(err2,res2)=>{
                if (err2){
                    return res.func(err2)
                }
                if(res2.affectedRows !==1){
                    return res.func('更新球队delete信息出错')
                }
                const sql3 = `update users_test set? where id=? and isDelete=0`
                db.query(sql3,[{teamID:null},userID],(err3,res3)=>{
                    if (err3) {
                        return res.func(err3)
                    }
                    if (res3.affectedRows !==1){
                        res.func('更新用户球队ID出错')
                    }
                    res.send({
                        status:200,
                        message:'删除球队成功'
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
    deleteJoinStatus,
    teamCreate,
    teamQuit,
    teamSetPic,
    teamInfoSet,
    teamPicSet,
    teamDelete
}
