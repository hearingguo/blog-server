const config = require('../config')
const Option = require('../models/option')
const msg = require("../config/message")

// 初始化网站Options
module.exports = async (ctx, next) => {

    const { title, subtitle, email, url } = config.OPTION

    let result = await Option
        .find()
        .exec()
        .catch(err => {
            ctx.throw(500, msg.msg_cn.error)
        })
    if (result.length === 0) {
        let option = new Option({
            title,
            subtitle,
            email,
            url
        })
        await option
            .save()
            .catch(err => {
                ctx.throw(500, msg.msg_cn.error)
            })
        console.log('初始化blog options完成!')
    }
    await next()
};