/**
 * 友情链接
 */
const mongoose = require('../mongodb').mongoose
const Tag = require('../models/tag')
const msg = require("../config/message")

const {
  handleSuccess,
  handleError
} = require("../utils/handle")

class TagController {
  // 获取
  static async getTags (ctx) {

    const { current_page = 1, page_size = 10, keyword = '', state = '' } = ctx.query

    // 过滤条件
		const options = {
			sort: { id: 1 },
			page: Number(current_page),
			limit: Number(page_size)
    }
    
    // 参数
		const querys = {
      name: new RegExp(keyword)
		}

    const links = await Link
                    .paginate(querys, options)
                    .catch(err => ctx.throw(500, msg.msg_cn.error))

    if (links) {
      handleSuccess({
        ctx,
        result: {
          pagination: {
            total: links.total,
            current_page: links.page,
            total_page: links.pages,
            page_size: links.limit
          },
          list: links.docs
        },
        message: msg.msg_cn.option_get_success
      })
    } else handleError({ ctx, message: '获取链接列表失败' })

  }

  // 添加
  static async postTag (ctx) {
    const { name, url } = ctx.request.body

		const link = await new Link({ name, url })
                    .save()
                    .catch(err => handleError({ ctx, message: msg.msg_cn.error }))
		if(link) handleSuccess({ ctx, result: link, message: msg.msg_cn.post_success })
		else handleError({ ctx, message: msg.msg_cn.post_fail })
  }

  // 修改
  static async putLink (ctx) {
    const _id = ctx.params.id
    const { name, url } = ctx.request.body

		if (!_id) {
      // 参数无效
			handleError({ ctx, message: msg.msg_cn.invalid_params })
			return false
    }

		const link = await Link
                  .findOneAndUpdate(_id, { name, url }, { new: true })
                  .catch(err => ctx.throw(500, msg.msg_cn.error ))
		if (link) handleSuccess({ ctx, result: link, message: msg.msg_cn.put_success })
		else handleError({ ctx, message: msg.msg_cn.put_fail })
  }

  // 删除
  static async deleteLink (ctx) {
    const _id = ctx.params.id

		if (!_id) {
			handleError({ ctx, message: msg.msg_cn.invalid_params })
			return false
		}

		let link = await Link
                .findOneAndRemove(_id)
                .catch(err => ctx.throw(500, msg.msg_cn.error))
		if(link) handleSuccess({ ctx, message: msg.msg_cn.delete_success })
		else handleError({ ctx, message: msg.msg_cn.delete_fail })
   
  }
}

module.exports = TagController