const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const socketIO = require('socket.io')
const UserModel= require('./db/MongoDB')


const ioJoinTeam = socketIO(server, {
    cors: {
        origin: '*'
    }
});

const ENTER = 0
const LEAVE = 1
const MESSAGE = 2

const socketUser =[]
ioJoinTeam.on('connection', socket => {
    // console.log(socket.)
    // const user = JSON.parse(socket.handshake.query.user)
    // console.log(user.username)
    socket.on('connectServer',(user)=>{
        // console.log(user)
        socketUser.push({
            user,
            socketID:socket.id
        })

        //存储 连接后的 用户 socketID
        UserModel.find({username:user},(error,docs)=>{
            if(error) { return console.log(error) }
            // console.log(docs)
            //[ { user: 'admin1', socketID: 'PfBtZdrG7VA1U31ZAAAD' } ]
            if(docs.length === 1){
                UserModel.updateOne({_id:docs[0]._id},{$set:{socketID:socket.id}},(err,doc)=>{
                    if(err) { return  console.log(err)}
                    console.log('修改老用户socket.id 成功' + socket.id)
                })
            }
            if(docs.length === 0){
                const User = new UserModel({
                    username:user,
                    socketID:socket.id
                })
                User.save((err,res)=>{
                    if(err){ return console.log(err) }
                    console.log('保存新用户socket.id 成功' + socket.id)
                })
            }
        })


        socket.on('ioJoinTeam',(newCaptain)=>{
            // console.log(CaptainID)
            socketUser.forEach(item=> {
                if (item.user === newCaptain) {
                    ioJoinTeam.to(item.socketID).emit('getJoinMsg', {
                        type: MESSAGE,
                        msg: `${user}想申请加入您的球队`,
                        time: new Date().toLocaleString()
                    })
                }
            })
        })
        console.log(socketUser)
        socket.on('disconnect', () => {
            console.log( user + "离线了")
            for( i = 0; i < socketUser.length; i++){
                if(socketUser[i].user === user){
                    socketUser.splice(i,1)
                    // console.log(socketUser)
                }
            }
        })
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
});



server.listen(3000, () => {
    console.log("ChatServer 运行在 http://127.0.0.1:3000")
})
