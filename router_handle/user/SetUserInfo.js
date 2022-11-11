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
    if (!req.body.username && !req.body.email) {
        return res.func('并没有设置任何更改',400)
    }
    const token = req.headers['authorization'].split(' ')[1]
    jwt.verify(token, config.jwtSecretKey, (error, payload) => {
        if (error) {
            return res.func('token过期，请重新登录', 401)
        }
        const userID = payload.id
        // const nickname = req.body.nickname
        const username = req.body.username
        const email = req.body.email
        // const updateTime = moment(req.body.updateTime).format()
        const sqls =
            [
                `select * from users_test where username=? and isDelete=0 and isValid=1`,
                `update users_test set username=?,email=? where id=? and isDelete=0 and isValid=1`,
                `update user_team set username=? where userID=? and isTrue=1`,
                `select * from team_test where CaptainID=? and isDelete=0`,
                `update team_test set newCaptain=? where CaptainID=? and isDelete=0 `,
                `select * from team_activity where captainID=? and acti_isOnApply=1`,
                `update team_activity set newCaptain=? where captainID=? and acti_isOnApply=1`,
                `select * from userjointeam where userID=? and joinStatusYes=1`,
                `update userjointeam set username=? where userID=? and joinStatusYes=1`,
                `select * from user_team where userID=? and isTrue=1`
            ]
        db.query(sqls[0],username,(errDB,resDB)=>{
            if (errDB)  { return res.func(errDB) }
            if ( resDB.length > 0 ) { return res.func('该昵称已存在',400)}
            db.query(sqls[1], [username,email, userID], (err1, res1) => {
                if (err1) return res.func(err1)
                if (res1.affectedRows !== 1) return res.func('个人信息更新失败', 400)
                db.query(sqls[9],userID,(err9,res9)=>{
                    if (err9) { return res.func(err9) }
                    if (res9.length > 0) {
                        db.query(sqls[2],[username,userID],(err2,res2)=>{
                            if (err2) return res.func(err2)
                            if (res2.affectedRows !== 1) return res.func('更新用户-球队表中的个人信息失败', 400)
                        })
                    }
                })
                db.query(sqls[3],userID,(err3,res3)=>{
                    if (err3) {return res.func(err3)}
                    if (res3.length > 0) {
                        db.query(sqls[4],[username,userID],(err4,res4)=>{
                            if (err4) {return res.func(err4)}
                            if (res4.affectedRows !== 1) { return res.func('更新球队表中的队长信息失败', 400) }
                        })
                    }
                })
                db.query(sqls[5],userID,(err5,res5)=>{
                    if (err5) {return res.func(err5)}
                    if (res5.length > 0) {
                        db.query(sqls[6],[username,userID],(err6,res6)=>{
                            if (err6) {return res.func(err6)}
                            if (res6.affectedRows !== 1) { return res.func('更新球队-活动表中的队长信息失败', 400) }
                        })
                    }
                })
                db.query(sqls[7],userID,(err7,res7)=>{
                    if (err7) {return res.func(err7)}
                    if (res7.length>0){
                        db.query(sqls[8],[username,userID],(err8,res8)=>{
                            if (err8) {return res.func(err8)}
                            if (res8.affectedRows !== 1) { return res.func('更新用户-球队申请表中的用户信息失败', 400) }
                        })
                    }
                })
                res.send({
                    status: 200,
                    message: '个人信息更新成功',
                    setUserData: {
                        username,
                        email,
                        // updateTime
                    }
                })
            })
        })
    })
}
