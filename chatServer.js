const express = require('express')
const app = express()
// const http = require('http')
const https = require('https')
// const server = http.createServer(app)
const server = https.createServer(app)
const socketIO = require('socket.io')
const UserModel= require('./db/MongoDB')

const ioJoinTeam = socketIO(server, {
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
});



server.listen(3000, () => {
    // console.log("ChatServer 运行在 http://127.0.0.1:3000")
    console.log("ChatServer 运行在 https://ifangtu.com:3000")

})


// console.log(socket.id)
// io.to(socket.id).emit('getMsg',1)
// io.to(socket.id).emit('getMsg',2)
// io.to(socket.id).emit('getMsg',3)
// socket.on('login',(user)=>{
//     count++
//     console.log(user + ' connected')
//     socketUser.push({
//         user,
//         socketID:socket.id
//     })
//     console.log(socketUser)
//     // let user = `用户${count}`
//     io.sockets.emit('broadcast_msg',
//         {
//             type: ENTER,
//             msg: `${user}加入群聊`,
//             time: new Date().toLocaleString()
//         })
//
//     socket.on('send_msg', (data) => {
//         // data = JSON.stringify(data)
//         console.log(`收到客户端的消息：${data.msg}`)
//         if(data.toUser){
//             socketUser.forEach(item=>{
//                 // console.log(item.user === data.toUser)
//                 if(item.user === data.toUser){
//                     io.to([item.socketID,socket.id]).emit('chatPrivate',{
//                         type: MESSAGE,
//                         msg: `${user}:${data.msg}`,
//                         time: new Date().toLocaleString()
//                     })
//                 }
//             })
//         }
//         // if (data.toUser !== user){
//         //     io.to(socket.id).emit('chatPrivate',{
//         //         type: MESSAGE,
//         //         msg: `${user}:${data.msg}`,
//         //         time: new Date().toLocaleString()
//         //     })
//         // }
//
//         // else {
//         //     io.sockets.emit('broadcast_msg', {
//         //         type: MESSAGE,
//         //         msg: `${user}:${data.msg}`,
//         //         time: new Date().toLocaleString()
//         //     })
//         // }
//     })
//     socket.on('disconnect', () => {
//         console.log(user + '  disconnected')
//         // socketUser = socketUser.filter(item=>item.user !== user)
//         io.sockets.emit('broadcast_msg', {
//             type: LEAVE,
//             msg: `${user}离开了群聊`,
//             time: new Date().toLocaleString()
//         })
//         count--
//     });
// })
