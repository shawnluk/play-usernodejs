const express = require('express')
const router = express.Router()
const userHandle = require('../router_handle/user/user')
const { reg_user_schema,login_user_schema } = require('../schema/userinfo_schema')
const expressJoi = require('@escook/express-joi')


//注册
router.post('/register', expressJoi(reg_user_schema), userHandle.userRegister)
//登陆
router.post('/login', expressJoi(login_user_schema), userHandle.userLogin)
// router.post('/login',userHandle.userLogin)
router.post('/wxlogin', userHandle.userWxLogin)


module.exports = router
