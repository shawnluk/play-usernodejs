const joi = require('joi')

const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
const nickname = joi.string().required()
// const id = joi.number().integer().min(1).required()
const email = joi.string().email().required()
const userPic = joi.string().dataUri().required()
// const userPic = joi.string().required()
// const userPic = joi.required()

exports.reg_user_schema = {
    body:{
        username,
        password
    }
}

exports.set_user_schema = {
    body: {
        nickname,
        email
    }
}

exports.set_userPwd_schema = {
    body:{
        oldPass:password,
        newPass: joi.not(joi.ref('oldPass')).concat(password)
    }
}

exports.set_userPic_schema = {
    body:{
        userPic
    }
}