const db = require('../db/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')

exports.setUserPwd = (req,res)=>{
    // res.send('密码重置成功')
    db.query(`select 1`,(err,result)=>{
        if(err){
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })

    // console.log(req)
    const token = req.headers['authorization'].split(' ')[1]
    jwt.verify(token,config.jwtSecretKey,(err,payload)=>{
        if( err )  {
            return  res.func('token过期，请重新登录',401)
        }
        const user_id = payload.id
        const sqlSel = `select * from users_test where id=? and isDelete=0`
        db.query(sqlSel,user_id,(err,result)=>{
            if ( err ) return res.func(err)
            if ( result.length !==1) return res.func('用户名不存在')

            const compareResult = bcrypt.compareSync(req.body.oldPass,result[0].password)
            if ( !compareResult ) return res.func('旧密码提交错误',400)
            req.body.newPass = bcrypt.hashSync(req.body.newPass,10)
            const sqlSetPwd = `update users_test set password=? where id=? and isDelete=0`
            db.query(sqlSetPwd,[req.body.newPass,user_id],(err,results)=>{
                if ( err ) return res.func(err)
                if ( results.affectedRows !==1 ) return res.func('重置密码失败')
                res.send({
                    status:0,
                    message:'重置密码成功'
                    // newToken：
                })

            })
            // console.log(result)
        })
    })
}