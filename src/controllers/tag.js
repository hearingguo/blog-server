/**
 * 标签
 */

const Tag = require('../models/tag')
const Article = require('../models/article')
const msg = require("../config/message")
const { PAGINATION } = require("../config/constent")
const { authIsVerified } = require('../utils/auth')

const {
  handleSuccess,
  handleError
} = require("../utils/handle")

class TagController {
  // 获取
  static async getTags(ctx) {

    const {
      cPage = PAGINATION.CURRENT, sPage = PAGINATION.SIZE, keyword = ''
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
      title: new RegExp(keyword)
    } : {}

    const tags = await Tag
      .paginate(querys, options)
      .catch(err => ctx.throw(500, msg.msg_cn.error))

    if (tags) {
      const tagClone = JSON.parse(JSON.stringify(tags))

      // 查找文章中标签的聚合
      let $match = {}

      // 非登录用户 只显示已发布的和公开
      if (!authIsVerified(ctx.request)) $match = { state: 1, publish: 1 }

      const article = await Article.aggregate([
        { $match },
        { $unwind: "$tag" },
        {
          $group: {
            _id: "$tag",
            num_tutorial: { $sum: 1 }
          }
        }
      ])
      if (article) {
        tagClone.docs.forEach((item) => {
          const finded = article.find(c => String(c._id) === String(item._id))
          item.count = finded ? finded.num_tutorial : 0
        })

        handleSuccess({
          ctx,
          result: {
            pagination: {
              total: tagClone.total,
              cPage: tagClone.page,
              total_page: tagClone.pages,
              sPage: tagClone.limit
            },
            list: tagClone.docs
          },
          message: msg.msg_cn.tag_get_success
        })
      } else handleError({
        ctx,
        message: msg.msg_cn.tag_get_fail
      })

    } else handleError({
      ctx,
      message: msg.msg_cn.tag_get_fail
    })

  }

  // 添加
  static async postTag(ctx) {
    const {
      title,
      description
    } = ctx.request.body

    const oldTag = await Tag
    .findOne({ title })
    .catch(err => ctx.throw(500, msg.msg_cn.error))
    
    if (oldTag) {
      handleError({
        ctx,
        message: msg.msg_cn.post_repeat
      })
      return
    }

    const tag = await new Tag({
        title,
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
      title,
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
        title,
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