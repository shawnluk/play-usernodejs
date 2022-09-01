const express = require('express')
const router = express.Router()
const { gerUserInfo }=require('../router_handle/getUserInfo')
const { baseInfoSet } = require('../router_handle/SetUserInfo')
const expressJoi = require('@escook/express-joi')
const { set_user_schema,set_userPwd_schema,set_userPic_schema } = require('../schema/userinfo_schema')
const { setUserPwd } = require('../router_handle/setUserPwd')
const { setuserPic } = require('../router_handle/setuserPic')
const  verifyToken  = require('../API/token')
const multer  = require('multer')
const upload = multer({ dest: './uploads/img' })

// router.get('/userinfo',verifyToken,gerUserInfo)
router.get('/userinfo',gerUserInfo)
router.post('/baseInfoSet',expressJoi(set_user_schema),baseInfoSet)
router.post('/setPwd',expressJoi(set_userPwd_schema),setUserPwd)
// router.post('/setPic',expressJoi(set_userPic_schema),upload.single('avatar'),setuserPic)
router.post('/setPic',upload.single('avatar'),setuserPic)

// router.get('/uploads/img',(req,res)=>{
//     res.func('成功',200)
// })

module.exports = router
