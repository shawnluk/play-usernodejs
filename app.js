const express = require('express')
const userRouter = require('./router/user')
const userInfoRouter = require('./router/userInfo')
const teamRouter = require('./router/team')
const cors = require('cors')
const joi = require('joi')

const app = express()

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

app.use((err, req, res, next) => {
    if (err instanceof joi.ValidationError) return res.func(err)
    // if(err.name === 'UnauthorizedError') return res.func('身份认证失败')
    res.func(err)
})

app.listen(3030, () => {
    console.log('服务器运行在 http://127.0.0.1:3030')
})

