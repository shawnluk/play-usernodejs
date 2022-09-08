const db = require('../../db/db')
const jwt = require('jsonwebtoken')
const config = require('../../config')

exports.getTeamInfo = (req, res) => {
    // console.log(req.body)
    db.query(`select 1`, (err, result) => {
        if (err) {
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })

    const token = req.headers['authorization'].split(' ')[1]
    jwt.verify(token, config.jwtSecretKey, (error, payload) => {
        if (error) {
            return res.func('token过期，请重新登录', 401)
        }

        const userID = payload.id
        const sqls = [
            `select teamID from users_test where id=? and isDelete=0`,
            `select * from team_test where id=? and isDelete=0`
        ]
        db.query(sqls[0], userID, (err, result) => {
            if (err) {
                return res.func(err)
            }
            if (result.length !== 1) {
                return res.func('查询所在球队id失败')
            }

            const teamID = result[0].teamID
            if (teamID === null && result.length === 1) {
                return res.func('暂未成功加入球队，请检查是否存在球队申请中', 201)
            } else {
                db.query(sqls[1], teamID, (err1, res1) => {
                    if (err1) {
                        return res.func(err1)
                    }
                    if (res1.length !== 1) {
                        res.func('查询球队信息失败', 400)
                    }
                    res.send({
                        status: 200,
                        message: '获取球队信息成功',
                        teamInfo: res1
                    })
                })
            }
        })
    })
}

