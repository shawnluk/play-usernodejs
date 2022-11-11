const db = require('../../db/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const moment = require("moment");
const axios = require('axios')

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
        if (result.length > 0) { return res.func('用户账户名被占用') }
        const lastLoginTime = moment(req.body.time).format()

        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        db.query(sqls[1], { userAccount:userinfo.userAccount, username: userinfo.username, password: userinfo.password,isDelete: 0,nickname:'user_Quinta', lastLoginTime}, (err1, res1) => {
            if (err1) { return res.func(err1) }
            // console.log(result)
            if (res1.affectedRows !== 1) { return res.func('注册账号插入失败', 400) }
            res.send({ status: 100, message: '注册成功' })
        })
    })
}

exports.userLogin = (req, res) => {
    // console.log(req.body)
    const userinfo = req.body
    db.query(`select 1`, (err, result) => {
        if (err) {
            return res.func('连接数据库失败')
            // console.log(err.message + '链接数据库失败')
        }
    })

    const sql = `select * from users_test where userAccount=? and isDelete=0`
    db.query(sql, userinfo.userAccount, (error, results) => {
        // console.log(result)
        if (error) { return res.func(error) }
        if (results.length !== 1) { return res.func('登陆失败，核对用户账户名数据出错', 400) }

        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) return res.func('密码错误', 400)
        // res.func('登陆成功')
        const lastLoginTime = moment(req.body.time).format()
        // console.log(lastLoginTime)
        const sql = `update users_test set lastLoginTime=? where userAccount=?`
        db.query(sql,[lastLoginTime,userinfo.userAccount],(err,result)=>{
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


exports.userWxLogin = (req,res) => {
    // console.log(req.body)
    // {
    //     code: '0231la0w38NeqZ2uF20w3Tw9Wu31la07',
    //         name: 'wx-luk',
    //     username: 'Luk.w'
    // }

    if(req.body.name === 'wx-luk' && req.body.code){
        axios.get('https://api.weixin.qq.com/sns/jscode2session',{
            params:{
                appid:'wxc7433c6549a52b54',
                secret:'a69f21e4ee8621b2c4ff4f4b4c2de518',
                js_code:req.body.code,
                grant_type:'authorization_code'
            }
        }).then(result=>{
            // console.log(result.data)
            // res.func(result.data,200)
            // {
            //     session_key: '3qE+smlUqJxUPTVWK026mg==',
            //     openid: 'oTH3s5RpTAhLmfAxsVQinShZHV5s'
            // }
            const sqls = [
                `select * from users_test where userAccount=? and isDelete=0 and isWechat=1 and isValid=1`,
                `insert into users_test set?`,
                `update users_test set password=? where userAccount=? and isWechat=1`,
                `select * from users_test where userAccount=? and isDelete=0 and isWechat=1 and isValid=1`,
            ]
            db.query(sqls[0],result.data.openid,(errors,results)=>{
                if (errors) { return res.func(errors) }
                //新建微信用户
                if (results.length === 0) {
                    db.query(sqls[1],
                    {
                        userAccount:result.data.openid,
                        username:req.body.username,
                        password:result.data.session_key,
                        userPic:req.body.userPic,
                        isWechat:1
                    },
                    (err1,res1)=>{
                        if (err1) { return res.func(err1) }
                        // console.log(res1)
                        if (res1.affectedRows !==1) { return  res.func('微信用户信息插入数据库失败',400) }
                        db.query(sqls[3],result.data.openid,(err3,res3)=>{
                            if (err3) { return res.func(err3) }
                            // console.log(res3)
                            const user = { ...res3[0], password: '', userAccount: '',userPic:'' }
                            const token = jwt.sign(user, config.jwtSecretKey)
                            res.send({
                                status:200,
                                message:'新建微信用户信息成功！',
                                token
                            })
                        })
                    })
                }
                //登陆过的微信用户
                if (results.length === 1) {
                    db.query(sqls[2], [ result.data.session_key,result.data.openid], (err2,res2)=>{
                        if (err2) { return res.func(err2) }
                        // console.log(res2)
                        if (res2.affectedRows !==1) { return  res.func('更新微信用户信息失败',400) }

                        //微信用户个人昵称更改了
                        // if(results[0].username !== req.body.username){
                        //     const wx_sqls =
                        //         [
                        //             `select * from user_team where userID=? and isTrue=1`,
                        //             `update user_team set username=? where userID=? and isTrue=1`,
                        //             `select * from team_test where CaptainID=? and isDelete=0`,
                        //             `update team_test set newCaptain=? where CaptainID=? and isDelete=0 `,
                        //             `select * from team_activity where captainID=? and acti_isOnApply=1`,
                        //             `update team_activity set newCaptain=? where captainID=? and acti_isOnApply=1`,
                        //             `select * from userjointeam where userID=? and joinStatusYes=1`,
                        //             `update userjointeam set username=? where userID=? and joinStatusYes=1`
                        //         ]
                        //     db.query(wx_sqls[0],results[0].id,(wxErr,wxRes)=>{
                        //         if ( wxErr ) { return res.func(wxErr) }
                        //         if ( wxRes.length > 0 ) {
                        //             db.query(wx_sqls[1],[req.body.username,results[0].id],(wxErr1,wxRes1)=>{
                        //                 if ( wxErr1 ) { return res.func(wxErr1) }
                        //                 if ( wxRes1.affectedRows !==1) { return res.func('微信用户更新用户-球队表信息失败',400) }
                        //             })
                        //         }
                        //     })
                        //     db.query(wx_sqls[2],results[0].id,(wxErr2,wxRes2)=>{
                        //         if ( wxErr2 ) { return res.func(wxErr2) }
                        //         if ( wxRes2.length > 0 ) {
                        //             db.query(wx_sqls[3],[req.body.username,results[0].id],(wxErr3,wxRes3)=>{
                        //                 if ( wxErr3 ) { return res.func(wxErr3) }
                        //                 if ( wxRes3.affectedRows !==1) { return res.func('微信用户更新球队表队长信息失败',400) }
                        //             })
                        //         }
                        //     })
                        //     db.query(wx_sqls[4],results[0].id,(wxErr4,wxRes4)=>{
                        //         if ( wxErr4 ) { return res.func(wxErr4) }
                        //         if ( wxRes4.length > 0 ) {
                        //             db.query(wx_sqls[5],[req.body.username,results[0].id],(wxErr5,wxRes5)=>{
                        //                 if ( wxErr5 ) { return res.func(wxErr5) }
                        //                 if ( wxRes5.affectedRows !==1) { return res.func('微信用户更新用户-球队-活动表信息失败',400) }
                        //             })
                        //         }
                        //     })
                        //     db.query(wx_sqls[6],results[0].id,(wxErr6,wxRes6)=>{
                        //         if ( wxErr6 ) { return res.func(wxErr6) }
                        //         if ( wxRes6.length > 0 ) {
                        //             db.query(wx_sqls[7],[req.body.username,results[0].id],(wxErr7,wxRes7)=>{
                        //                 if ( wxErr7 ) { return res.func(wxErr1) }
                        //                 if ( wxRes7.affectedRows !==1) { return res.func('微信用户更新用户-球队加入申请表信息失败',400) }
                        //             })
                        //         }
                        //     })
                        // }
                        //更新token
                        db.query(sqls[3],result.data.openid,(err3,res3)=>{
                            if (err3) { return res.func(err3) }
                            // console.log(res3)
                            const user = { ...res3[0], password: '', userAccount: '',userPic:'' }
                            const tokenStr = jwt.sign(user, config.jwtSecretKey)
                            res.send({
                                status:200,
                                message:'更新微信用户信息成功！',
                                token: 'Bearer ' + tokenStr
                            })
                        })
                    })
                }
            })
            // const token = jwt.sign(result.data,config.jwtSecretKey)
            // res.send({
            //     status:200,
            //     token
            // })
        }).catch(error=>{
            console.log(error)
        })
    }
}
