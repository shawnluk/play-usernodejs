const db = require('../../db/db')
const jwt = require('jsonwebtoken')
const config = require('../../config')

exports.getTeamMember = (req, res) => {
    // res.send('收到获取成员列表')
    // console.log(req.body)
    db.query(`select 1`, (err, result) => {
        if (err) {
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })

    const token = req.headers['authorization'].split(' ')[1]
    const teamID = req.body.teamID
    jwt.verify(token, config.jwtSecretKey, (error, payload) => {
        if (error) {
            return res.func('token过期，请重新登录', 401)
        }

        //验证用户所在球队
        const userID = payload.id
        const sql = `select teamID from users_test where id=?`
        db.query(sql, userID, (err, result) => {
            if (err) {
                return res.func(err)
            }
            // console.log(result)
            if (result.length !== 1) {
                return res.func('查询失败，请重新登陆再试')
            }
            if (result.length === 1 && result[0].teamID !== teamID) {
                return res.func('所提交teamID与你所在的teamID有误', 400)
            }
            const sqls = `select id,username from users_test where teamID='${ teamID }' ; select userID,username from userjointeam where teamID=${ teamID } and joinStatusYes=1`
            db.query(sqls, (errs, results) => {
                if (errs) {
                    return res.func(errs)
                }
                res.send({
                    status: 200,
                    message: '获取球员列表成功',
                    memberList: results
                })
            })
        })
    })
}


