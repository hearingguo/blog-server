/**
 * 标签
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

    const { current_page = 1, page_size = 10, keyword = '' } = ctx.query

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

    const tags = await Tag
                    .paginate(querys, options)
                    .catch(err => ctx.throw(500, msg.msg_cn.error))

    if (tags) {
      handleSuccess({
        ctx,
        result: {
          pagination: {
            total: tags.total,
            current_page: tags.page,
            total_page: tags.pages,
            page_size: tags.limit
          },
          list: tags.docs
        },
        message: msg.msg_cn.tag_get_success
      })
    } else handleError({ ctx, message: msg.msg_cn.tag_get_fail })

  }

  // 添加
  static async postTag (ctx) {
    const { name, description } = ctx.request.body

		const tag = await new Tag({ name, description })
                    .save()
                    .catch(err => handleError({ ctx, message: msg.msg_cn.error }))
		if(tag) handleSuccess({ ctx, result: tag, message: msg.msg_cn.tag_post_success })
		else handleError({ ctx, message: msg.msg_cn.tag_post_fail })
  }

  // 修改
  static async putTag (ctx) {
    const _id = ctx.params.id
    const { name, description } = ctx.request.body

		if (!_id) {
      // 参数无效
			handleError({ ctx, message: msg.msg_cn.invalid_params })
			return false
    }

		const tag = await Tag
                  .findByIdAndUpdate(_id, { name, description }, { new: true })
                  .catch(err => ctx.throw(500, msg.msg_cn.error ))
		if (tag) handleSuccess({ ctx, result: tag, message: msg.msg_cn.tag_put_success })
		else handleError({ ctx, message: msg.msg_cn.tag_put_fail })
  }

  // 删除
  static async deleteTag (ctx) {
    const _id = ctx.params.id

		if (!_id) {
			handleError({ ctx, message: msg.msg_cn.invalid_params })
			return false
		}

		let tag = await Tag
                .findByIdAndRemove(_id)
                .catch(err => ctx.throw(500, msg.msg_cn.error))
		if(tag) handleSuccess({ ctx, message: msg.msg_cn.tag_delete_success })
		else handleError({ ctx, message: msg.msg_cn.tag_delete_fail })
   
  }
}

module.exports = TagController