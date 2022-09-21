const db = require('../../db/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const moment = require('moment')

exports.setPassword = (req, res) => {
    // res.send('密码重置成功')
    db.query(`select 1`, (err, result) => {
        if (err) {
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })

    // console.log(req)
    const token = req.headers['authorization'].split(' ')[1]
    jwt.verify(token, config.jwtSecretKey, (error, payload) => {
        if (error) {
            return res.func('token过期，请重新登录', 401)
        }
        const sqls = [
            `select * from users_test where id=? and isDelete=0 and isValid=1`,
            `update users_test set password=? where id=? and isDelete=0 and isValid=1`
        ]

        const userID = payload.id
        db.query(sqls[0], userID, (err, result) => {
            if (err) return res.func(err)
            if (result.length !== 1) return res.func('用户名不存在')

            const compareResult = bcrypt.compareSync(req.body.oldPass, result[0].password)
            if (!compareResult) { return res.func('旧密码提交错误', 400) }
            req.body.newPass = bcrypt.hashSync(req.body.newPass, 10)
            // const updateTime = moment(req.body.time).format()
            db.query(sqls[1], [req.body.newPass,updateTime, userID], (err1, res1) => {
                if (err1) return res.func(err1)
                if (res1.affectedRows !== 1) return res.func('重置密码失败',400)
                res.send({
                    status: 200,
                    message: '重置密码成功',
                    // newToken：
                    // updateTime
                })
            })
        })
    })
}
