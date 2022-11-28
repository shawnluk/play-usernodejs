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

