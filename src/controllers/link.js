/**
 * 友情链接
 */
const Link = require('../models/link')
const msg = require("../config/message")

const {
  handleSuccess,
  handleError
} = require("../utils/handle")

class LinkController {
  // 获取
  static async getLinks(ctx) {

    const {
      cPage = 1, sPage= 10, keyword = '', state = ''
    } = ctx.query

    // 过滤条件
    const options = {
      sort: {
        date: -1
      },
      page: Number(cPage),
      limit: Number(sPage)
    }

    // querys
    const querys = keyword ? {
      username: new RegExp(keyword)
    } : {}

    const links = await Link
      .paginate(querys, options)
      .catch(err => ctx.throw(500, msg.msg_cn.error))

    if (links) {
      handleSuccess({
        ctx,
        result: {
          pagination: {
            total: links.total,
            cPage: links.page,
            tPage: links.pages,
            sPage: links.limit
          },
          list: links.docs
        },
        message: msg.msg_cn.link_get_success
      })
    } else handleError({
      ctx,
      message: msg.msg_cn.link_get_fail
    })

  }

  // 添加
  static async postLink(ctx) {
    const {
      username,
      url
    } = ctx.request.body

    const oldLink = await Link
      .findOne({ username })
      .catch(err => ctx.throw(500, msg.msg_cn.error))

    if (oldLink) {
      handleError({
        ctx,
        message: msg.msg_cn.post_repeat
      })
      return
    }

    const link = await new Link({
        username,
        url
      })
      .save()
      .catch(err => handleError({
        ctx,
        message: msg.msg_cn.error
      }))
    if (link) handleSuccess({
      ctx,
      result: link,
      message: msg.msg_cn.link_post_success
    })
    else handleError({
      ctx,
      message: msg.msg_cn.link_post_fail
    })
  }

  // 修改
  static async putLink(ctx) {
    const _id = ctx.params.id
    const {
      username,
      url
    } = ctx.request.body

    if (!_id) {
      // 参数无效
      handleError({
        ctx,
        message: msg.msg_cn.invalid_params
      })
      return false
    }

    const link = await Link
      .findOneAndUpdate({ _id }, {
        username,
        url
      }, {
        new: true
      })
      .catch(err => ctx.throw(500, msg.msg_cn.error))
    if (link) handleSuccess({
      ctx,
      result: link,
      message: msg.msg_cn.link_put_success
    })
    else handleError({
      ctx,
      message: msg.msg_cn.link_put_fail
    })
  }

  // 删除
  static async deleteLink(ctx) {
    const _id = ctx.params.id

    if (!_id) {
      handleError({
        ctx,
        message: msg.msg_cn.invalid_params
      })
      return false
    }

    let link = await Link
      .findOneAndRemove({ _id })
      .catch(err => ctx.throw(500, msg.msg_cn.error))
    if (link) handleSuccess({
      ctx,
      message: msg.msg_cn.link_delete_success
    })
    else handleError({
      ctx,
      message: msg.msg_cn.link_delete_fail
    })

  }
}

module.exports = LinkController