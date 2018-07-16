/**
 * 网站基本信息
 */

const Option = require('../model/option')

const {
  handleSuccess,
  handleError
} = require("../utils/handle")

class OptionController {
  // 获取
  static async getOption (ctx) {
    const option = await Option
                        .findOne()
                        .catch(err => ctx.throw(500, '服务器错误'))
    if (option) handleSuccess({ ctx, result: option, message: '获取配置项成功' })
    else handleError({ ctx, message: '获取配置项失败'})
  }

  // 修改
  static async putOption (ctx) {
    const _id = ctx.request.body._id
    const option = await (_id
                    ? Option.findByIdAndUpdate(_id, ctx.request.body, { new: true })
                    : new Option(ctx.request.body).save())
                    .catch(err => ctx.throw(500, '服务器错误'))
    if (option) handleSuccess({ ctx, result: option._id, message: '修改配置项成功' })
    else handleError({ ctx, message: '修改配置项失败' }) 
  }
}

module.exports = OptionController