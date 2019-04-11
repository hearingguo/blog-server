/**
 * 分类
 */

const Classify = require('../models/classify')
const Article = require('../models/article')
const msg = require("../config/message")
const { PAGINATION } = require("../config/constent")
const { authIsVerified } = require('../utils/auth')

const {
  handleSuccess,
  handleError
} = require("../utils/handle")

class ClassifyController {
  // 获取
  static async getClassify(ctx) {

    const {
      page = PAGINATION.CURRENT, limit = PAGINATION.SIZE, keyword = ''
    } = ctx.query

    // 过滤条件
    const options = {
      sort: {
        date: -1
      },
      page: Number(page),
      limit: Number(limit)
    }

    // querys
    const querys = keyword ? {
      title: new RegExp(keyword)
    } : {}

    const classify = await Classify
      .paginate(querys, options)
      .catch(err => ctx.throw(500, msg.msg_cn.error))

    if (classify) {
      const classifyClone = JSON.parse(JSON.stringify(classify))

      // 查找文章中分类的聚合
      let $match = {}

      // 非登录用户 只显示已发布的和公开
      if (!authIsVerified(ctx.request)) $match = { state: 1, publish: 1 }

      const article = await Article.aggregate([
        { $match },
        { $unwind: "$classify" },
        {
          $group: {
            _id: "$classify",
            num_tutorial: { $sum: 1 }
          }
        }
      ])
      if (article) {
        classifyClone.docs.forEach((item) => {
          const finded = article.find(c => String(c._id) === String(item._id))
          item.count = finded ? finded.num_tutorial : 0
        })

        handleSuccess({
          ctx,
          result: {
            pagination: {
              total: classifyClone.total,
              page: classifyClone.page,
              limit: classifyClone.limit
            },
            list: classifyClone.docs
          },
          message: msg.msg_cn.classify_get_success
        })
      } else handleError({
        ctx,
        message: msg.msg_cn.classify_get_fail
      })
    } else handleError({
      ctx,
      message: msg.msg_cn.classify_get_fail
    })

  }

  // 添加
  static async postClassify(ctx) {
    const {
      title,
      name,
      description
    } = ctx.request.body

    const oldClassify = await Classify
    .findOne({ name })
    .catch(err => ctx.throw(500, msg.msg_cn.error))

    if (oldClassify) {
      handleError({
        ctx,
        message: msg.msg_cn.post_repeat
      })
      return
    }

    const classify = await new Classify({
       title,
        name,
        description
      })
      .save()
      .catch(err => handleError({
        ctx,
        message: msg.msg_cn.error
      }))
      
    if (classify) handleSuccess({
      ctx,
      result: classify,
      message: msg.msg_cn.classify_post_success
    })
    else handleError({
      ctx,
      message: msg.msg_cn.classify_post_fail
    })
  }

  // 修改
  static async putClassify(ctx) {
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

    const classify = await Classify
      .findOneAndUpdate({ _id }, {
        title,
        description
      }, {
        new: true
      })
      .catch(err => ctx.throw(500, msg.msg_cn.error))
    if (classify) handleSuccess({
      ctx,
      result: classify,
      message: msg.msg_cn.classify_put_success
    })
    else handleError({
      ctx,
      message: msg.msg_cn.classify_put_fail
    })
  }

  // 删除
  static async deleteClassify(ctx) {
    const _id = ctx.params.id

    if (!_id) {
      handleError({
        ctx,
        message: msg.msg_cn.invalid_params
      })
      return false
    }

    let classify = await Classify
      .findOneAndRemove({ _id })
      .catch(err => ctx.throw(500, msg.msg_cn.error))
    if (classify) handleSuccess({
      ctx,
      message: msg.msg_cn.classify_delete_success
    })
    else handleError({
      ctx,
      message: msg.msg_cn.classify_delete_fail
    })

  }
}

module.exports = ClassifyController