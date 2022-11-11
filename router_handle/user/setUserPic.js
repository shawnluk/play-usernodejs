const db = require('../../db/db')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const fs = require('fs')
const cosUpload = require('../../API/Cos_Cloud')

exports.setuserPic = (req, res) => {
    // res.send('更换头像成功')
    db.query('select 1', (err, result) => {
        if (err) return res.func('数据库链接失败')
    })
    // console.log(req.file)
    // console.log(req.body)
    // console.log( req.headers)
    const token = req.headers['authorization'].split(' ')[1]
    jwt.verify(token, config.jwtSecretKey, (error, payload) => {
        if (error) return res.func('token过期，请重新登录', 401)
        const userID = payload.id
        // const username = payload.username
        // const userAccount = payload.userAccount
        // console.log(payload)
        const type = req.file.mimetype.split('/')[1]
        const oldPicName = req.file.path
        let Key, newPicName
        if (type === 'png') {
            Key = '10551/userPic/' + userID + '.png'
            newPicName = req.file.path + '.png'
        } else {
            Key = '10551/userPic/' + userID + '.jpg'
            newPicName = req.file.path + '.jpg'
        }
        // const Key = '10551/userPic/' + userID + '.jpg'
        // const newPicName = req.file.path + '.jpg'
        fs.renameSync(oldPicName, newPicName)

        cosUpload(newPicName, Key).then(obj => {
            // console.log(obj)
            if (obj.statusCode === 200) {
                fs.unlink(newPicName, function (errors) {
                    if (errors) { throw errors; }
                    // console.log('本地文件:' + newPicName + '删除成功！');
                })
                const userPic = 'https://' + obj.location +  '?' +'temp='+ Math.random()
                const sql = `update users_test set userPic=? where id=? and isDelete=0`
                db.query(sql, [userPic, userID], (err, result) => {
                    if (err) return res.func(err)
                    // console.log(result)
                    if (result.affectedRows !== 1) return res.func('数据库插入头像地址失败', 400)
                    // res.func('更新用户头像成功', 200)

                    res.send({
                        status:200,
                        userPic,
                        message:'更新头像成功'
                    })
                })
            } else {
                res.func('用户头像存储失败', 400)
            }
        })
    })
}
