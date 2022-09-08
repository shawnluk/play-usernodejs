const express = require('express')
const router = express.Router()
const { gerUserInfo } = require('../router_handle/user/getUserInfo')
const { baseInfoSet } = require('../router_handle/user/SetUserInfo')
const expressJoi = require('@escook/express-joi')
const { set_user_schema, set_userPwd_schema, set_userPic_schema } = require('../schema/userinfo_schema')
const { setPassword } = require('../router_handle/user/setPassword')
const { setuserPic } = require('../router_handle/user/setUserPic')
const verifyToken = require('../API/token')
const multer = require('multer')
const upload = multer({ dest: './uploads/img' })

const postDate = require('../router_handle/postDate')

// router.get('/userinfo',verifyToken,gerUserInfo)
router.get('/userinfo', gerUserInfo)
router.post('/baseInfoSet', expressJoi(set_user_schema), baseInfoSet)
router.post('/setPassword', expressJoi(set_userPwd_schema), setPassword)
// router.post('/setPic',expressJoi(set_userPic_schema),upload.single('avatar'),setuserPic)
router.post('/setPic', upload.single('avatar'), setuserPic)
router.post('/date', postDate)

// router.get('/uploads/img',(req,res)=>{
//     res.func('成功',200)
// })

module.exports = router
