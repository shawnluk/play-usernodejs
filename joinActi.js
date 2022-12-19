const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const socketIO = require('socket.io')
const db = require('./db/db')

const ioJoinActi = socketIO(server, {
    cors: {
        origin: '*'
    },
    allowEIO3: true
});
const socketUser =[]
ioJoinActi.on('connection',socket=>{
    ioJoinActi.to(socket.id).emit('wx',{
        id:socket.id
    })
    socket.on('connectServerJoinActi',(userObj)=>{
        console.log(userObj.username + '上线了')
        const userID = userObj.userID
        socketUser.push({
            username:userObj.username,
            socketID:socket.id
        })
        //存储 连接后的 用户 socketID
        db.query(`select 1`, (err, result) => {
            if (err) {
                return res.func('连接数据库失败')
                // console.log(err.message + '链接数据库失败')
            }
        })

        const sqls = [
            'select id from user_socket where userID=? and isVoid=1 and status=1',
            'INSERT INTO user_socket SET?',
            'UPDATE user_socket SET socketID=? where userID=? and isVoid=1 and status=1',
            'select socketID from user_socket where userID=? and isVoid=1 and status=1'
        ]
        db.query(sqls[0],userID,(error,result)=>{
            console.log(result)
            if (result.length === 0) {
                db.query(sqls[1],[{
                    userID,
                    socketID:socket.id
                }],(error1,result1)=>{
                    // console.log(result1)
                    if (error1 || result1.affectedRows!==1 ) {
                        ioJoinActi.to(socket.id).emit('getJoinActiMsg',{
                            msg:'通信发生错误，无法发送消息给活动发起人，请撤销申请加入并重试',
                            status:400
                        })
                    }

                })
            }
            if (result.length === 1) {

                // //获取所有申请参加活动的信息
                // db.query(`select userID from activity_user where isJoin=1 and isJoinAgree=0 and status=1`,(errors,results)=>{
                //     if (errors)
                // })


                db.query(sqls[2],[socket.id,userID],(error2,result2)=>{
                    // console.log(result2)
                    if (error2 || result2.affectedRows!==1 ) {
                        ioJoinActi.to(socket.id).emit('getJoinActiMsg',{
                            msg:'通信发生错误，无法发送消息给活动发起人，请撤销申请加入并重试',
                            status:400
                        })
                    }
                })
            }
        })

        //发送消息给活动该负责人
        socket.on('userJoinActi',(joinActivityData)=>{
            console.log(joinActivityData)
            const CaptainID = joinActivityData.CaptainID
            db.query(sqls[3],CaptainID,(err3,res3)=>{
                console.log(res3)
            })
        })

    })
})



server.listen(3001, () => {
    console.log("userJoinActi 运行在 http://127.0.0.1:3001")
    // console.log("ChatServer 运行在 https://ifangtu.com:3000")
})
