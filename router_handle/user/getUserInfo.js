const db = require('../../db/db')
const jwt = require('jsonwebtoken')
// const { verifyToken } = require('../API/token')
const config = require('../../config')


exports.gerUserInfo = (req, res) => {

    db.query(`select 1`, (error, result) => {
        if (error) {
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')

        }
    })
    // console.log(req.headers)
    const token = req.headers['authorization'].split(' ')[1]
    // verifyToken(req.headers.authorization)
    jwt.verify(token, config.jwtSecretKey, (error, payload) => {
        if (error) { return res.func('token过期，请重新登录', 401 )
        }
        // console.log(payload)
        /* {
              id: 11,
              userAccount: 'admin10',
              username: 'admin10',
              password: '',
              nickname: 'admin10',
              email: null,
              userPic: '',
              createTime: '2022-10-24T03:47:06.000Z',
              updateTime: '2022-10-24T13:56:36.000Z',
              lastLoginTime: '2022-10-24T13:56:36.000Z',
              isDelete: 0,
              isValid: 1,
              isWechat: 0,
              iat: 1666663857,
              exp: 1666750257
            }
            */
        const user_id = payload.id
        const sql = `select id,username,email,userPic,createTime from users_test where id=? and isDelete=0 and isValid=1`
        db.query(sql, user_id, (err, result) => {
            if (err) return res.func(err)
            // console.log(result)
            if (result.length !== 1) return res.func('获取信息失败')
            res.send({
                status: 200,
                message: '获取个人信息成功',
                userData: result[0]
            })
        })
    })
}
