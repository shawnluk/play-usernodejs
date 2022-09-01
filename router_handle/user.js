const  db = require('../db/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')
// const { expiresIn } = require( "../config" )

exports.userRegister = (req,res)=>{
    const userinfo = req.body
    // console.log(req.body)
    //合法性校验
    // if( !userinfo.username || !userinfo.password ){return res.func('用户名或密码不合法')}

    db.query(`select 1`,(err,result)=>{
        if(err){
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })
    // 判断用户名是否存在
    const sqlStrSel = `select * from users_test where username=?`
    db.query(sqlStrSel,userinfo.username,(err,result)=>{

        if(err){ return res.func(err)}

        if (result.length>0){return res.func('用户名被占用')}

        userinfo.password = bcrypt.hashSync(userinfo.password,10)
        const sqlStrIns = `insert into users_test set?`
        db.query(sqlStrIns,{username:userinfo.username,password:userinfo.password,isDelete:0},(err,result)=>{
            if (err){return res.func(err)}
            // console.log(result)
            if(result.affectedRows !==1){return res.func('注册账号插入失败',400)}

            res.send({status:100,message:'注册成功'})
        })
    })
}

exports.userLogin = (req,res)=>{
    // res.send('登陆成功')
    const userinfo = req.body
    // console.log(userinfo)
    db.query(`select 1`,(err,result)=>{
        if(err){
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })
    const strSel = `select * from users_test where username=? and isDelete=0`
    db.query(strSel,userinfo.username,(err,result)=>{
        // console.log(result)
        if(err){
            return res.func(err)
        }

        if(result.length !==1) {
            return res.func('登陆失败，核对用户名数据出错',400)
        }
        const compareResult = bcrypt.compareSync(userinfo.password,result[0].password)
        if (!compareResult) return res.func('密码错误',400)
        // res.func('登陆成功')
    //    生成token
        const user = {...result[0],password:'',userPic:''}
        // console.log(user)
        const tokenStr = jwt.sign(user,config.jwtSecretKey,{expiresIn: config.expiresIn})
        res.send({
            status:100,
            message:'登陆成功',
            userData:{
                userID:user.id,
                userName:user.username,
                token:'Bearer '+ tokenStr,
            }
        })
    })
}
