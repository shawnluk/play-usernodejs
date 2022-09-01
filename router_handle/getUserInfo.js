const db = require('../db/db')
const jwt = require('jsonwebtoken')
// const { verifyToken } = require('../API/token')
const config = require('../config')



exports.gerUserInfo = (req,res)=>{

    db.query(`select 1`,(err,result)=>{
        if(err){
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')

        }
    })
    // console.log(req.headers)
    const token = req.headers['authorization'].split(' ')[1]
    // console.log(token + '111')
    // verifyToken(req.headers.authorization)
    // console.log(token)
    jwt.verify(token,config.jwtSecretKey,(jwtErr,payload)=>{
        if( jwtErr )  {
            return  res.func('token过期，请重新登录',401)
            // return  res.func(err)
        }
        // console.log(payload)
        const user_id = payload.id
        // const sqlGet = `select id,username,nickname,email,userPic,teamID,teamName from users_test where id=?`
        const sqlGet = `select id,username,nickname,email,userPic,teamID,(select teamName from team_test where id = users_test.teamID)as teamName from users_test where id=? and isDelete=0`
        // console.log(req)
        db.query(sqlGet,user_id,(err,result)=>{
            // console.log(req)
            if(err) return res.func(err)
            // console.log(result)
            if(result.length !==1) return res.func('获取信息失败')
            res.send({
                status:200,
                message:'获取个人信息成功',
                userData:result[0]
            })
        })
    })
}