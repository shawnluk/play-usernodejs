const joi = require('joi')

const userAccount = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()
const username = joi.string().required()
// const nickname = joi.string().required()
// const id = joi.number().integer().min(1).required()
const email = joi.string().email().required()
const userPic = joi.string().dataUri().required()
// const userPic = joi.string().required()
// const userPic = joi.required()
const time = joi.string()
// const code = joi.string()
// const name = joi.string()

exports.reg_user_schema = {
    body: {
        username,
        userAccount,
        password,
        time,
        // code,
        // name
    }
}

exports.login_user_schema = {
    body: {
        userAccount,
        password,
        time,
        // code,
        // name
    }
}

exports.set_user_schema = {
    body: {
        username,
        email,
        time
    }
}

exports.set_userPwd_schema = {
    body: {
        oldPass: password,
        newPass: joi.not(joi.ref('oldPass')).concat(password),
        time
    }
}

exports.set_userPic_schema = {
    body: {
        userPic,
        time
    }
}
