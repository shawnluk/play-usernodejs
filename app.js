const express = require('express')

const userRouter = require('./router/user')
const userInfoRouter = require('./router/userInfo')
const teamRouter = require('./router/team')
const cors = require('cors')
// const joi = require('joi')

const fs = require('fs');
const https = require('https')
const http = require("http");
// const path =require('path');

const httpsOption = {
    key: fs.readFileSync('./https/ifangtu.com.key'),
    cert: fs.readFileSync('./https/ifangtu.com.pem')
}

const app = express()

const httpServer = http.createServer(app)
const httpsServer = https.createServer(httpsOption,app)
// const chatServer = https.createServer(httpsOption,app)

/*socket io*/
const socketIO = require('socket.io')
const UserModel= require('./db/MongoDB')
const ioJoinTeam = socketIO(httpsServer, {
    cors: {
        origin: '*'
    }
});
const socketUser =[]
ioJoinTeam.on('connection', socket => {
    // console.log(socket.)
    // const user = JSON.parse(socket.handshake.query.user)
    // console.log(user.username)
    socket.on('connectServer',(userObj)=>{
        console.log(userObj.username + '上线了')
        socketUser.push({
            username:userObj.username,
            socketID:socket.id
        })
        console.log(socketUser)
        //存储 连接后的 用户 socketID
        UserModel.find({userID:userObj.userID},(error,docs)=>{
            // if(error) { return console.log(error) }
            if(error) {
                ioJoinTeam.to(socket.id).emit('getJoinMsg',{
                    msg:'connect error',
                    status:400
                })
                return
            }
            //[ { user: 'admin1', socketID: 'PfBtZdrG7VA1U31ZAAAD' } ]
            if(docs.length === 1){
                if(docs[0].chatContent.length !==0){
                    const arrSend = docs[0].chatContent.filter(item =>  item.isVoid === 1 )
                    if(arrSend.length !==0){
                        ioJoinTeam.to(socket.id).emit('getJoinMsg',{
                            msg:arrSend,
                            status:200
                        })
                    }
                }
                UserModel.updateOne({_id:docs[0]._id},{$set:{socketID:socket.id,username:userObj.username,isOnline:1}},(err,doc)=>{
                    if(err) {
                        ioJoinTeam.to(socket.id).emit('getJoinMsg',{
                            msg:'update your account error',
                            status:400
                        })
                        return
                    }
                    console.log('修改老用户socket.id 成功' + socket.id)
                })
            }
            if(docs.length === 0){
                const User = new UserModel({
                    username:userObj.username,
                    userID:userObj.userID,
                    socketID:socket.id,
                    isOnline:1,
                    chatContent:[]
                })
                User.save((err,res)=>{
                    if(err) {
                        ioJoinTeam.to(socket.id).emit('getJoinMsg',{
                            msg:'create and save your account error',
                            status:400
                        })
                        return
                    }
                    console.log('保存新用户socket.id 成功' + socket.id)
                })
            }
        })


        /*申请加入球队后向该球队队长发送通知*/
        socket.on('JoinTeam',(newCaptain)=>{
            UserModel.find({username:newCaptain},(err,res)=>{
                if (err) { return console.log(err) }
                // console.log(res)
                // console.log(res[0].chatContent.some(item=>{ return item.fromUser === user})) ===> true
                //已存在相同用户发送的消息，只能发送一次 $set
                const chatLength = res[0].chatContent.length
                const chatTrue = res[0].chatContent.some(item=>{ return item.fromUser === userObj.username && item.isVoid !==0})
                // const chatVoid = res[0].chatContent[0].isVoid
                // && res[0].chatContent[0].isVoid !==0
                if(chatLength !==0 && chatTrue){
                    UserModel.findOneAndUpdate(
                        {_id:res[0]._id},
                        {$set:
                                {
                                    "chatContent.$[el].message":`${userObj.username}想申请加入您的球队`,
                                    "chatContent.$[el].time":new Date().toLocaleString(),
                                    "chatContent.$[el].isRead":0,
                                    "chatContent.$[el].isVoid":1
                                }
                        },
                        {arrayFilters:[{ "el.fromUser":userObj.username }]},
                        (err1,res1)=>{
                            if (err1) { return console.log(err1) }
                            const arrSend = res1.chatContent.filter(item =>  item.isVoid === 1 )
                            if(arrSend.length !==0){
                                ioJoinTeam.to(res[0].socketID).emit('getJoinMsg',{
                                    msg:arrSend,
                                    status:200
                                })
                            }
                            console.log(res1 + '来自相同用户发送的消息更新完毕')
                        }
                    )
                    return
                }

                //新用户发送消息 $push
                UserModel.findOneAndUpdate(
                    {_id:res[0]._id},
                    {$push: {
                            chatContent: {
                                message:`${userObj.username}想申请加入您的球队`,
                                fromUser:`${userObj.username}`,
                                fromUserID:`${userObj.userID}`,
                                time:new Date().toLocaleString(),
                                isRead:0,
                                isVoid:1
                            }
                        }
                    },
                    {new: true},
                    (err2,res2)=>{
                        if (err2) { return console.log(err2) }
                        console.log(res2 + 'push新信息成功')
                        const arrSend = res2.chatContent.filter(item =>  item.isVoid === 1 )
                        if(arrSend.length !==0){
                            ioJoinTeam.to(res[0].socketID).emit('getJoinMsg',{
                                msg:arrSend,
                                status:200
                            })
                        }
                    })
            })
        })

        /*删除加入球队申请后向该球队队长发送通知*/
        socket.on('deleteJoinTeam',(newCaptain)=>{
            UserModel.find({username:newCaptain},(err,res)=>{
                if (err) { return console.log(err)}
                UserModel.findOneAndUpdate(
                    {_id:res[0]._id},
                    {$set:
                            {
                                "chatContent.$[el].message":`${userObj.username}已撤销申请加入您的球队`,
                                "chatContent.$[el].time":new Date().toLocaleString(),
                                "chatContent.$[el].isRead":1,
                                "chatContent.$[el].isVoid":0
                            }
                    },
                    {
                        arrayFilters:[{ "el.fromUser":userObj.username,"el.isVoid":1 }],
                        new:true
                    },
                    (err1,res1)=>{
                        if (err1) { return console.log(err1) }
                        const arrDeleteSend = res1.chatContent.filter(item =>  item.isVoid === 0 && item.fromUser === userObj.username ).slice(-1)
                        const arrSend = res1.chatContent.filter(item =>  item.isVoid ===1)
                        ioJoinTeam.to(res[0].socketID).emit('getDeleteJoinMsg',{
                            msg:arrDeleteSend,
                            status:200
                        })
                        ioJoinTeam.to(res[0].socketID).emit('getJoinMsg',{
                            msg:arrSend,
                            status:200
                        })
                        // console.log( res1 + '来自相同用户发送的删除球队申请消息发送完毕' )
                        console.log( '来自相同用户发送的删除球队申请消息发送完毕' )
                    }
                )
            })
        })

        /*队长同意某个人用户加入球队的申请*/
        socket.on('agreeJoin',(obj)=>{
            // { fromUser: 'admin3', msgID: '63350b67ab836af18db2f291' }
            UserModel.findOneAndUpdate(
                {socketID:socket.id},
                {$set:{
                        "chatContent.$[el].message":`已同意${obj.fromUser}申请加入您的球队`,
                        "chatContent.$[el].isRead" : 1,
                        "chatContent.$[el].isVoid" : 0,
                    }
                },
                {
                    arrayFilters:[{ "el._id":obj.msgID }],
                    new:true
                },
                (err,res)=>{
                    if (err) { return console.log(err) }
                    //res: doc本身
                    console.log('更新加入球队申请通过')
                    const arrSend = res.chatContent.filter(item =>  item.isVoid ===1)
                    ioJoinTeam.to(socket.id).emit('getJoinMsg',{
                        msg:arrSend,
                        status:200
                    })
                }
            )
        })


        socket.on('disconnect', () => {
            for( i = 0; i < socketUser.length; i++){
                if(socketUser[i].username === userObj.username){
                    socketUser.splice(i,1)
                    // console.log(socketUser)
                    UserModel.updateOne({userID:userObj.userID},{$set:{isOnline:0}},(err,res)=>{
                        if (err) { return console.log(err) }
                        console.log( userObj.username + "离线了")
                    })
                }
            }
        })
    })
})

app.use(function (req, res, next) {
    res.func = function (err, status = 1) {
        res.send(
            {
                status,
                message: err instanceof Error ? err.message : err
            }
        )
    }
    next()
})
app.use(cors())
app.use(express.json())
//解析表单数据(application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: false }))
app.use(express.static('./uploads'))

app.use('/user', userRouter)
app.use('/my', userInfoRouter)
app.use('/team', teamRouter)


app.get('/netbooks', async (req, res) => {
    res.status(200).send('Hello World!')
})

httpServer.listen(3030, () => {
    console.log('服务器运行在 http://127.0.0.1:3030')
})
// httpsServer.listen(3030, () => {
//     console.log('服务器运行在 https://ifangtu.com:3030')
// })

// chatServer.listen(3000, () => {
//     // console.log("ChatServer 运行在 http://127.0.0.1:3000")
//     console.log("ChatServer 运行在 https://ifangtu.com:3000")
//
// })
