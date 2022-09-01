const db = require('../db/db')
const jwt = require('jsonwebtoken')
const config = require('../config')

exports.getTeamMember = (req,res)=>{
    // res.send('收到获取成员列表')
    // console.log(req.body)
    db.query(`select 1`,(err,result)=>{
        if(err){
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })
    const token = req.headers['authorization'].split(' ')[1]
    const teamID = req.body.teamID
    jwt.verify(token,config.jwtSecretKey,(err,payload)=>{
        if(err){return res.func('token过期，请重新登录',401)}

        const userID = payload.id
        const sql = `select teamID from users_test where id=?`
        db.query(sql,userID,(err3,res3)=>{
            if (err3) {
                return res.func(err3)
            }
            // console.log(res3)
            if(res3.length !==1){
                return res.func('查询失败，请重新登陆再试')
            }
            if (res3.length === 1 && res3[0].teamID !== teamID){
                return  res.func('所提交teamID与你所在的teamID有误',400)
            }
            const sql1 = `select id,username from users_test where teamID=?`
            const sql2 = `select userID,username from userjointeam where teamID=? and joinStatusYes=?`
            // const sql3 = `select CaptainId,newCaptain from team_test where ID=?`
            db.query(sql1,teamID,(err1,list1)=>{
                if(err1) {return res.func(err1)}
                // console.log(list1)
                // if (res1.length ===0){return res.func('无成员信息',202)}
                // res.send({
                //     status:200,
                //     data:res1
                // })
                db.query(sql2,[teamID,1],(err2,list2)=>{
                    if(err2) {return res.func(err2)}
                    // console.log(res2)
                    // db.query(sql3,teamID,(err3,list3)=>{
                    //     if(err3) {return res.func(err3)}
                    // console.log(res3)
                    res.send({
                        status:200,
                        message:'获取球员列表成功',
                        memberData:{
                            list1,list2,
                            // list3
                        }
                        // })
                    })
                })
            })
        })

    })
}


