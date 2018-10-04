/**
 * 网站基本信息
 */

const Option = require('../models/option')
const msg = require("../config/message")

const {
  handleSuccess,
  handleError
} = require("../utils/handle")

class OptionController {
  // 获取
  static async getOption (ctx) {
    const option = await Option
                        .findOne()
                        .catch(err => ctx.throw(500, msg.msg_cn.error))
    if (option) handleSuccess({ ctx, result: option, message: msg.msg_cn.option_get_success })
    else handleError({ ctx, message: msg.msg_cn.option_get_fail })
  }

  // 修改
  static async putOption (ctx) {
    const _id = ctx.request.body._id
    const option = await (_id
                    ? Option.findByIdAndUpdate(_id, ctx.request.body, { new: true })
                    : new Option(ctx.request.body).save())
                    .catch(err => ctx.throw(500, msg.msg_cn.error))
    if (option) handleSuccess({ ctx, result: option._id, message: msg.msg_cn.option_put_success })
    else handleError({ ctx, message: msg.msg_cn.option_put_fail })
  }
}

module.exports = OptionController