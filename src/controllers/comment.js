/* 
*
*  评论
* 
*/

const Comment = require('../models/comment')
const Article = require('../models/article')
const msg = require("../config/message")
const geoip = require('geoip-lite')

const {
  handleSuccess,
  handleError
} = require('../utils/handle')

class CommentController {

  // 获取评论
  static async getComments (ctx) {
		let { sort = -1, current_page = 1, page_size = 20, keyword = '', post_id, state } = ctx.query

		sort = Number(sort)

		// 过滤条件
		const options = {
			sort: { _id: sort },
			page: Number(current_page),
			limit: Number(page_size)
		}

		// 查询参数
		let querys = {}

		// 查询各种状态
		if (state && ['0', '1', '2'].includes(state)) {
			querys.state = state;
		}

		// 关键词查询
		if (keyword) {
			const keywordReg = new RegExp(keyword);
			querys['$or'] = [
				{ 'content': keywordReg },
				{ 'author.name': keywordReg },
				{ 'author.email': keywordReg }
			]
		}

		// 请求评论
		const comments = await Comment
													.paginate(querys, options)
													.catch(err => ctx.throw(500, msg.msg_cn.error))
		if (comments) {
			handleSuccess({
				ctx,
				message: msg.msg_cn.comment_get_success,
				result: {
					pagination: {
						total: comments.total,
						current_page: options.page,
						total_page: comments.pages,
						per_page: options.limit
					},
					data: comments.docs
				}
			})
		} else handleError({ ctx, message: msg.msg_cn.comment_get_fail })

  }

  // 添加评论
  static async postComment (ctx) {
    let { body: comment } = ctx.request
		
		// 获取 ip 以及 地址
		const ip = (ctx.req.headers['x-forwarded-for'] || 
		ctx.req.headers['x-real-ip'] || 
		ctx.req.connection.remoteAddress || 
		ctx.req.socket.remoteAddress ||
		ctx.req.connection.socket.remoteAddress ||
		ctx.req.ip ||
		ctx.req.ips[0]).replace('::ffff:', '');
		comment.ip = ip
		comment.agent = ctx.headers['user-agent'] || comment.agent
	
    const ip_location = geoip.lookup(ip)
    
    if (ip_location) {
			comment.city = ip_location.city,
			comment.range = ip_location.range,
			comment.country = ip_location.country
    }
    
    comment.likes = 0

    // 发布评论
		const res = await new Comment(comment)
                  .save()
                  .catch(err => ctx.throw(500, msg.msg_cn.error))
    if (res) {
      handleSuccess({ ctx, result: res, message: msg.msg_cn.comment_post_success });
      // 1、更新相关文章  2、发送邮件给评论者

    } else handleError({ ctx, message: msg.msg_cn.comment_post_fail })

  }

  // 审核通过评论
  static async putComment (ctx) {
    const _id = ctx.params.id
		let { ids, state, author } = ctx.request.body

		if (!state || !ids) {
			ctx.throw(401, msg.msg_cn.invalid_params)
			return false
		}

		const res = await Comment
											.findByIdAndUpdate(_id, ctx.request.body)
											.catch(err => ctx.throw(500, msg.msg_cn.error))
		if (res) {
			handleSuccess({ ctx, message: msg.msg_cn.comment_put_success })
      // 更新相关文章
      
		}
		else handleError({ ctx, message: msg.msg_cn.comment_put_fail })
  }

  // 删除评论
  static async deleteComment (ctx) {
    const _id = ctx.params.id
		const res = await Comment
											.findByIdAndRemove(_id)
											.catch(err => ctx.throw(500, msg.msg_cn.error))
		if (res) {
			handleSuccess({ ctx, message: msg_cn.msg_cn.comment_delete_success })
      // 更新相关文章

		}
		else handleError({ ctx, message: msg_cn.msg_cn.comment_delete_fail })
  }

}

module.exports = CommentController
