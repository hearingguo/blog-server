/**
 * 分类
 */

const Classify = require('../models/classify')
const msg = require("../config/message")
const { PAGINATION } = require("../config/constent")

const {
  handleSuccess,
  handleError
} = require("../utils/handle")

class ClassifyController {
  // 获取
  static async getClassify(ctx) {

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

    // 参数
    // querys
    const querys = keyword ? {
      title: new RegExp(keyword)
    } : {}

    const classify = await Classify
      .paginate(querys, options)
      .catch(err => ctx.throw(500, msg.msg_cn.error))

    if (classify) {
      handleSuccess({
        ctx,
        result: {
          pagination: {
            total: classify.total,
            cPage: classify.page,
            tPage: classify.pages,
            sPage: classify.limit
          },
          list: classify.docs
        },
        message: msg.msg_cn.classify_get_success
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
      description
    } = ctx.request.body

    const classify = await new Classify({
        title,
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