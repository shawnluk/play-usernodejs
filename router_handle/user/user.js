const db = require('../../db/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const moment = require("moment");
// const { expiresIn } = require( "../config" )

exports.userRegister = (req, res) => {
    // console.log(req.body)
    //合法性校验
    // if( !userinfo.username || !userinfo.password ){return res.func('用户名或密码不合法')}

    db.query(`select 1`, (err, result) => {
        if (err) {
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })
    // 判断用户名是否存在
    const sqls = [
        `select * from users_test where username=?`,
        `insert into users_test set?`
    ]

    const userinfo = req.body
    db.query(sqls[0], userinfo.username, (error, result) => {
        if (error) { return res.func(error) }
        if (result.length > 0) { return res.func('用户名被占用') }
        const createTime = moment(req.body.time).format()

        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        db.query(sqls[1], { username: userinfo.username, password: userinfo.password, createTime,isDelete: 0 }, (err1, res1) => {
            if (err1) { return res.func(err1) }
            // console.log(result)
            if (res1.affectedRows !== 1) { return res.func('注册账号插入失败', 400) }
            res.send({ status: 100, message: '注册成功' })
        })
    })
}

exports.userLogin = (req, res) => {
    // res.send('登陆成功')
    const userinfo = req.body
    // console.log(req.body)
    db.query(`select 1`, (err, result) => {
        if (err) {
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })

    const sql = `select * from users_test where username=? and isDelete=0`
    db.query(sql, userinfo.username, (error, results) => {
        // console.log(result)
        if (error) { return res.func(error) }
        if (results.length !== 1) { return res.func('登陆失败，核对用户名数据出错', 400) }

        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) return res.func('密码错误', 400)
        // res.func('登陆成功')
        const lastLoginTime = moment(req.body.time).format()
        // console.log(lastLoginTime)
        const sql = `update users_test set lastLoginTime=? where username=?`
        db.query(sql,[lastLoginTime,userinfo.username],(err,result)=>{
            if (err) { return res.func(err) }
            if (result.affectedRows !==1) { return res.func('记录登陆时间失败,请重新登陆',400) }
            //    生成token
            const user = { ...results[0], password: '', userPic: '' }
            // console.log(user)
            const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
            res.send({
                status: 100,
                message: '登陆成功',
                userData: {
                    userID: user.id,
                    userName: user.username,
                    lastLoginTime,
                    token: 'Bearer ' + tokenStr,
                }
            })
        })
    })
}
