const db = require('../db/db')
const moment = require('moment')

module.exports = function postDate (req,res) {
    console.log(req.body)
    // console.log(typeof req.body.date)
    const createTime = moment(req.body.loginTime).format()
    // const createTime = req.body.date
    // console.log(createTime)
    const sql = `insert into time_test set?`
    // db.query(sql,{createTime},(err,result)=>{
    //     if (err) { return res.func(err) }
    //     // console.log(result)
    //     if(result.affectedRows !==1) { return  res.func('存入datetime模式出错',400)}
    //     res.send({
    //         status:200,
    //         message:'时间存储成功',
    //         time:createTime
    //     })
    // })
}