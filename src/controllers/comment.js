/* 
*
*  评论
* 
*/

const Comment = require('../models/comment')
const msg = require("../config/message")
const geoip = require('geoip-lite')

const {
  handleSuccess,
  handleError
} = require('../utils/handle')

class CommentController {

  // 获取评论
  static async getComments (ctx) {

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
    } else handleError({ ctx, message: msg.msg_cn.comment_post_fail })

  }

  // 审核通过评论
  static async putComment (ctx) {

  }

  // 删除评论
  static async deleteComment (ctx) {
    
  }

}

module.exports = CommentController
