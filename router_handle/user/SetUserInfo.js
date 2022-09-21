const db = require('../../db/db')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const moment = require("moment");


exports.baseInfoSet = function (req, res) {
    // res.send('更新信息成功')
    db.query(`select 1`, (err, result) => {
        if (err) {
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })
    // console.log(req.body)
    const token = req.headers['authorization'].split(' ')[1]
    jwt.verify(token, config.jwtSecretKey, (error, payload) => {
        if (error) {
            return res.func('token过期，请重新登录', 401)
        }
        const userID = payload.id
        const nickname = req.body.nickname
        const email = req.body.email
        // const updateTime = moment(req.body.updateTime).format()
        const sql = `update users_test set nickname=?,email=? where id=? and isDelete=0 and isValid=1`
        db.query(sql, [nickname,email, userID], (err, result) => {
            if (err) return res.func(err)
            if (result.affectedRows !== 1) return res.func('个人信息更新失败', 400)
            res.send({
                status: 200,
                message: '个人信息更新成功',
                setUserData: {
                    nickname,
                    email,
                    // updateTime
                }
            })
        })
    })
}
