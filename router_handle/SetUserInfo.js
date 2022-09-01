const db = require('../db/db')
const jwt = require('jsonwebtoken')
const config = require('../config')


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
    jwt.verify(token, config.jwtSecretKey, (err, payload) => {
        if (err) {
            return res.func('token过期，请重新登录',401)
        }
        const user_id = payload.id
        const sqlSet = `update users_test set ? where id=? and isDelete=0`
        db.query(sqlSet, [req.body, user_id], (err1, result) => {
            if (err1) return res.func(err1)
            console.log(result)
            if (result.affectedRows !== 1) return res.func('个人信息更新失败', 404)
            res.send({
                status: 200,
                message: '个人信息更新成功',
                setUserData: req.body
            })
        })
    })

}