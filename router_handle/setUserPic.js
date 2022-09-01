const db = require('../db/db')
const jwt = require('jsonwebtoken')
const config = require('../config')
const fs = require('fs')
const cosUpload = require('../API/Cos_Cloud')

exports.setuserPic = (req,res)=>{
    // res.send('更换头像成功')
    db.query('select 1',(err,result)=>{
        if ( err ) return res.func('数据库链接失败')
    })

    // console.log(req)
    const token = req.headers['authorization'].split(' ')[1]
    const type = req.file.mimetype.split('/')[1]
    // const userPic = req.body.userPic
    // console.log(userPic)
    // const picFile = req.file
    // console.log(picFile)
    // console.log(type)
    // console.log(req.file.path)

    jwt.verify(token,config.jwtSecretKey,(err1,payload)=>{
        if (err1) return res.func('token过期，请重新登录',401)
        const userID= payload.id
        const username = payload.username

        const oldPicname = req.file.path
        let Key,newPicname

        if (type === 'png'){
            Key = '10551/userPic/'+ username + '.png'
            newPicname =  req.file.path +'.png'
        }else{
            Key = '10551/userPic/'+ username + '.jpg'
            newPicname =  req.file.path +'.jpg'
        }
        fs.renameSync(oldPicname,newPicname)

        // console.log(oldPicname)
        // console.log(newPicname)

        cosUpload(newPicname,Key).then(obj=>{
            console.log(obj)
            if (obj.statusCode === 200){

                fs.unlink(newPicname, function(err2){
                    if(err2){
                        throw err2;
                    }
                    console.log('本地文件:'+newPicname+'删除成功！');
                })
                const userPic = obj.location
                const sqlUpt = `update users_test set userPic=? where id=? and isDelete=0`
                db.query(sqlUpt,[userPic,userID],(err,result)=>{
                    if ( err ) return res.func(err)
                    // console.log(result)
                    if ( result.affectedRows !==1 ) return res.func('数据库插入头像地址失败',400)
                    res.send({
                        status:0,
                        message:'更新头像成功'
                    })
                })
            }else {
                res.func('存储失败',404)
            }
        })

    })
}
