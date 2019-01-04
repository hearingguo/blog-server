/**
 * 标签
 */

const Tag = require('../models/tag')
const msg = require("../config/message")

const {
  handleSuccess,
  handleError
} = require("../utils/handle")

class TagController {
  // 获取
  static async getTags(ctx) {

    const {
      cPage = 1, sPage = 10, keyword = ''
    } = ctx.query

    // 过滤条件
    const options = {
      sort: {
        id: 1
      },
      page: Number(cPage),
      limit: Number(sPage)
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
            cPage: tags.page,
            total_page: tags.pages,
            sPage: tags.limit
          },
          list: tags.docs
        },
        message: msg.msg_cn.tag_get_success
      })
    } else handleError({
      ctx,
      message: msg.msg_cn.tag_get_fail
    })

  }

  // 添加
  static async postTag(ctx) {
    const {
      name,
      description
    } = ctx.request.body

    const tag = await new Tag({
        name,
        description
      })
      .save()
      .catch(err => handleError({
        ctx,
        message: msg.msg_cn.error
      }))
    if (tag) handleSuccess({
      ctx,
      result: tag,
      message: msg.msg_cn.tag_post_success
    })
    else handleError({
      ctx,
      message: msg.msg_cn.tag_post_fail
    })
  }

  // 修改
  static async putTag(ctx) {
    const _id = ctx.params.id
    const {
      name,
      description
    } = ctx.request.body

    if (!_id) {
      // 参数无效
      handleError({
        ctx,
        message: msg.msg_cn.invalid_params
      })
      return false
    }

    const tag = await Tag
      .findOneAndUpdate({ _id }, {
        name,
        description
      }, {
        new: true
      })
      .catch(err => ctx.throw(500, msg.msg_cn.error))
    if (tag) handleSuccess({
      ctx,
      result: tag,
      message: msg.msg_cn.tag_put_success
    })
    else handleError({
      ctx,
      message: msg.msg_cn.tag_put_fail
    })
  }

  // 删除
  static async deleteTag(ctx) {
    const _id = ctx.params.id

    if (!_id) {
      handleError({
        ctx,
        message: msg.msg_cn.invalid_params
      })
      return false
    }

    let tag = await Tag
      .findOneAndRemove({ _id })
      .catch(err => ctx.throw(500, msg.msg_cn.error))
    if (tag) handleSuccess({
      ctx,
      message: msg.msg_cn.tag_delete_success
    })
    else handleError({
      ctx,
      message: msg.msg_cn.tag_delete_fail
    })

  }
}

module.exports = TagController