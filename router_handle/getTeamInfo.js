const db = require('../db/db')
const jwt = require('jsonwebtoken')
const config = require('../config')


exports.getTeamInfo =  (req,res)=>{
    // console.log(req.body)

    db.query(`select 1`,(err,result)=>{
        if(err){
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })

    const token = req.headers['authorization'].split(' ')[1]

    jwt.verify(token,config.jwtSecretKey,(errJwt,payload)=>{

        if(errJwt) {
            return res.func('token过期，请重新登录',401)
        }
        const userID = payload.id
        const sql = `select teamID from users_test where id=? and isDelete=0`
        db.query(sql,userID,(err1,res1)=> {
            if (err1) {
                return res.func(err1)
            }
            if (res1.length !== 1) {
                return res.func('查询加入球队id失败')
            }
            // console.log(res1)
            const sqlSel = `select * from team_test where id=? and isDelete=0`
            if (res1[0].teamID === null && res1.length === 1){
                return  res.func('',201)
            }else {
                const teamID = res1[0].teamID
                db.query(sqlSel,teamID,(err2,res2)=>{
                    if (err2){
                        return res.func(err2)
                    }
                    if(res2.length !==1){
                        res.func('查询球队名称失败')
                    }
                    res.send({
                        status:200,
                        message:'获取球队信息成功',
                        teamInfo:res2
                    })
                })
            }
        })



    })
}

