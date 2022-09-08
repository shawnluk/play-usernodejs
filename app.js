const express = require('express')
const userRouter = require('./router/user')
const userInfoRouter = require('./router/userInfo')
const teamRouter = require('./router/team')
const cors = require('cors')
const joi = require('joi')
// const config = require('./config')
// const expressJwt = require('express-jwt')
// const multer  = require('multer')
// const upload = multer({ dest: './uploads/img' })

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
// app.use(expressJwt({secret:config.jwtSecretKey,algorithms:['HS256']}).unless({path:[/^\/api\//]}))
// app.use(expressJwt({secret:config.jwtSecretKey}).unless({path:[/^\/user\//]}))

// app.post('/uploads/img', upload.single('avatar'), (req, res,next) => {
//     // console.log(req.file);
//     // console.log(req.body)
//     // res.send('hello world')
//     res.send({
//         status:200,
//         message:'成功'
//     })
//     // next()
// })
app.use(cors())
app.use(express.json())
//解析表单数据(application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: false }))

// app.get('/uploads/img',(req,res)=>{
//     res.func('成功',200)
// })

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