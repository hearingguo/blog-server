/* 
 *
 *  评论
 * 
 */
const blogInfo = require("../config/url")
const Comment = require('../models/comment')
const Article = require('../models/article')
const msg = require("../config/message")
const {
	sendMail
} = require('../utils/email')
const geoip = require('geoip-lite')

const {
	handleSuccess,
	handleError
} = require('../utils/handle')

// 聚合评论所关联的文章
const updateArticleCommentsCount = (postIds = []) => {
	postIds = [...new Set(postIds)].filter(id => !!id)
	if (postIds.length) {
		Comment.aggregate([{
					$match: {
						state: 1,
						postId: {
							$in: postIds
						}
					}
				},
				{
					$group: {
						_id: "$postId",
						num_tutorial: {
							$sum: 1
						}
					}
				}
			])
			.then(counts => {
				if (counts.length === 0) {
					Article.update({
							id: postIds[0]
						}, {
							$set: {
								'meta.comments': 0
							}
						})
						.then(info => {

						})
						.catch(err => {

						})
				} else {
					counts.forEach(count => {
						Article.update({
								id: count._id
							}, {
								$set: {
									'meta.comments': count.num_tutorial
								}
							})
							.then(info => { //评论聚合更新成功

							})
							.catch(err => { //评论聚合更新失败'

							});
					});
				}
			})
			.catch(err => {
				console.warn(msg.msg_cn.query_fail, err);
			})
	}
};

// 邮件通知网站主及目标对象
const sendMailToAdminAndTargetUser = (comment, permalink) => {
	sendMail({ // 给博主发送邮件
		to: 'highyaguo@163.com',
		subject: '博客有新的留言',
		text: `来自 ${comment.commentator.name} 的留言：${comment.content}`,
		html: `<p> 来自 ${comment.commentator.name} 的留言：${comment.content}</p><br><a href="${permalink}" target="_blank">[ 点击查看 ]</a>`
	});
	if (!!comment.pid) {
		Comment.findOne({
			id: comment.pid
		}).then(parentComment => { // 给父联发送邮件
			sendMail({
				to: parentComment.commentator.email,
				subject: '你在highya.me有新的评论回复',
				text: `来自 ${comment.commentator.name} 的评论回复：${comment.content}`,
				html: `<p> 来自${comment.commentator.name} 的评论回复：${comment.content}</p><br><a href="${permalink}" target="_blank">[ 点击查看 ]</a>`
			})
		})
	}
}


class CommentController {

	// 获取评论
	static async getComments(ctx) {
		let {
			sort = -1, page = 1, limit = 20, keyword = '', postId, state
		} = ctx.query

		sort = Number(sort)

		// 过滤条件
		const options = {
			sort: {
				_id: sort
			},
			page: Number(page),
			limit: Number(limit)
		}

		// 排序
		if ([1, -1].includes(sort)) {
			options.sort = {
				_id: sort
			} // 按时间排序
		} else if (Object.is(sort, 2)) { // 按点赞排序
			options.sort = {
				likes: -1
			}
		};

		// 查询
		let querys = {}

		// 状态
		if (state && ['0', '1', '2'].includes(state)) {
			querys.state = state;
		}

		// 关键词
		if (keyword) {
			const keywordReg = new RegExp(keyword);
			querys['$or'] = [{
					'content': keywordReg
				},
				{
					'commentator.name': keywordReg
				},
				{
					'commentator.email': keywordReg
				}
			]
		}

		// post-id 过滤
		if (!Object.is(postId, undefined)) {
			querys.postId = postId
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
            page: comments.page,
            tPage: comments.pages,
            limit: comments.limit
					},
					list: comments.docs
				}
			})
		} else {
			handleError({ ctx, message: msg.msg_cn.comment_get_fail })
		}

	}

	// 添加评论
	static async postComment(ctx) {
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
			comment.addr = `${ip_location.country},${ip_location.range},${ip_location.city}`
		}

		comment.likes = 0
		let permalink = ''

		if (Number(comment.postId) !== 0) {
			// 永久链接
			const article = await Article
				.findOne({ id: comment.postId }, '_id')
				.catch(err => ctx.throw(500, msg.msg_cn.error))
			permalink = `${blogInfo.BLOGHOST}/article/${article._id}`
		} else {
			permalink = `${blogInfo.BLOGHOST}/about`
		}

		// 发布评论
		const res = await new Comment(comment)
			.save()
			.catch(err => ctx.throw(500, msg.msg_cn.error))
		if (res) {
			handleSuccess({ ctx, result: res, message: msg.msg_cn.comment_post_success });
			// 1、更新相关文章  
			updateArticleCommentsCount([res.postId])
			//2、发送邮件给评论者
			sendMailToAdminAndTargetUser(res, permalink)
		} else handleError({ ctx, message: msg.msg_cn.comment_post_fail})
	}

	// 修改评论
	static async putComment(ctx) {
		const _id = ctx.params.id
		let { postIds, state } = ctx.request.body

		if (!state || !postIds) {
			ctx.throw(401, msg.msg_cn.invalid_params)
			return false
		}

		postIds = Array.of(Number(postIds))

		const res = await Comment
			.findOneAndUpdate({ _id }, ctx.request.body)
			.catch(err => ctx.throw(500, msg.msg_cn.error))
		if (res) {
			handleSuccess({ ctx, message: msg.msg_cn.comment_put_success })
			// 更新相关文章
			updateArticleCommentsCount(postIds)
		} else handleError({ ctx, message: msg.msg_cn.comment_put_fail })
	}

	// 删除评论
	static async deleteComment(ctx) {
		const _id = ctx.params.id
		const postIds = Array.of(Number(ctx.query.postIds))
		const res = await Comment
			.findOneAndRemove({ _id })
			.catch(err => ctx.throw(500, msg.msg_cn.error))
		if (res) {
			handleSuccess({ ctx, message: msg_cn.msg_cn.comment_delete_success })
			// 更新相关文章
			updateArticleCommentsCount(postIds)
		} else handleError({ ctx, message: msg_cn.msg_cn.comment_delete_fail })
	}
}

module.exports = CommentController