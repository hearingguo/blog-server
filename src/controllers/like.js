/*
 *
 * 喜欢文章
 *
 */

const Article = require('../models/article')
const msg = require("../config/message")
const Comment = require('../models/comment')

const {
  handleSuccess,
  handleError
} = require('../utils/handle')

class LikeController {
  // 添加
  static async postLike(ctx) {
    const {
      _id,
      type
    } = ctx.request.body

    if (!_id || !type || ![0, 1].includes(Number(type))) {
      handleError({
        ctx,
        message: msg.msg_cn.invalid_params
      })
      return false
    }

    // type -> 0 文章, type -> 1 评论
    const res = await (Number(type) === 0 ? Article : Comment)
      .findOne({ _id })
      .catch(err => ctx.throw(500, msg.msg_cn.error))
    if (res) {
      if (Number(type) === 0) res.meta.likes += 1
      else res.likes += 1
      const info = await res
        .save()
        .catch(err => ctx.throw(500, msg.msg_cn.error))
      if (info) handleSuccess({
        ctx,
        message: msg.msg_cn.like_post_success
      })
      else handleError({
        ctx,
        message: msg.msg_cn.like_post_fail
      })
    } else handleError({
      ctx,
      message: msg.msg_cn.like_post_fail
    })
  }
}

module.exports = LikeController