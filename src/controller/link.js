/**
 * 友情链接
 */

const Link = require('../model/link')
const msg = require("../config/message")

const {
  handleSuccess,
  handleError
} = require("../utils/handle")

class LinkController {
  // 获取
  static async getLinks (ctx) {
    const links = await Link
                    .find()
                    .catch(err => ctx.throw(500, msg.msg_ch.error))
    if (links) handleSuccess({ ctx, result: links, message: msg.msg_ch.option_get_success })
    else handleError({ ctx, message: msg.msg_ch.option_get_fail })
  }

  // 添加
  static async postLink (ctx) {
    const { name, url } = ctx.request.body

		const link = await new Link({ name, url })
                    .save()
                    .catch(err => handleError({ ctx, message: msg.msg_ch.error }))
		if(link) handleSuccess({ ctx, result: link, message: msg.msg_ch.post_success })
		else handleError({ ctx, message: msg.msg_ch.post_fail })
  }

  // 修改
  static async putLink (ctx) {
    const _id = ctx.params.id
    const { name, url } = ctx.request.body
    
		if (!_id) {
			handleError({ ctx, message: msg.msg_ch.invalid_params })
			return false
    }
    
		const link = await Link
                  .findByIdAndUpdate(_id, { name, url }, { new: true })
                  .catch(err => ctx.throw(500, msg.msg_ch.error ))
		if (link) handleSuccess({ ctx, result: link, message: msg.msg_ch.put_success })
		else handleError({ ctx, message: msg.msg_ch.put_fail })
  }

  // 删除
  static async deleteLink (ctx) {
    const _id = ctx.params.id

		if (!_id) {
			handleError({ ctx, message: msg.msg_ch.invalid_params })
			return false
		}

		let link = await Link
                .findByIdAndRemove(_id)
                .catch(err => ctx.throw(500, msg.msg_ch.error))
		if(link) handleSuccess({ ctx, message: msg.msg_ch.delete_success })
		else handleError({ ctx, message: msg.msg_ch.delete_fail })
   
  }
}

module.exports = LinkController