/* 
 *
 *  文章
 * 
 */

const Article = require('../models/article')
const msg = require("../config/message")

const {
  handleSuccess,
  handleError
} = require('../utils/handle')

class ArticleController {

  // 添加文章
  static async postArticle(ctx) {

    const { title, tag } = ctx.request.body
    
    if (!tag.length) {
      handleError({
        ctx,
        message: msg.msg_cn.error_params
      })
      return
    }

    const oldArticle = await Article
      .findOne({ title })
      .catch(err => ctx.throw(500, msg.msg_cn.error))

    if (oldArticle) {
      handleError({
        ctx,
        message: msg.msg_cn.post_repeat
      })
      return
    }

    const res = await new Article(ctx.request.body)
      .save()
      .catch (err => {
        if (err.name === 'ValidationError') {
          ctx.throw(500, msg.msg_cn.error_params)
        } else {
          ctx.throw(500, msg.msg_cn.error)
        }
      })

    if (res) handleSuccess({
      ctx,
      message: msg.msg_cn.article_post_success
    })
    else handleError({
      ctx,
      message: msg.msg_cn.article_put_fail
    })
  }

  // 删除文章
  static async deleteArticle(ctx) {
    const _id = ctx.params.id

    if (!_id) {
      handleError({
        ctx,
        message: msg.msg_cn.invalid_params
      })
      return false
    }

    const res = await Article
      .findOneAndRemove({ _id })
      .catch(err => ctx.throw(500, msg.msg_cn.error))
    if (res) handleSuccess({
      ctx,
      message: msg.msg_cn.article_delete_success
    })
    else handleError({
      ctx,
      message: msg.msg_cn.article_delete_fail
    })
  }

  // 修改文章
  static async putArticle(ctx) {
    const _id = ctx.params.id

    const {
      title,
      keyword
    } = ctx.request.body

    delete ctx.request.body.create_at
    delete ctx.request.body.update_at
    delete ctx.request.body.meta

    if (!_id) {
      handleError({
        ctx,
        message: msg.msg_cn.invalid_params
      })
      return false
    }

    if (!title || !keyword) {
      // title, keyword必填
      handleError({
        ctx,
        message: msg.msg_cn.error_params
      })
      return false
    }

    const res = await Article
      .findOneAndUpdate({ _id }, ctx.request.body)
      .catch(err => ctx.throw(500, msg.msg_cn.error))
    if (res) handleSuccess({
      ctx,
      result: res,
      message: msg.msg_cn.article_put_success
    })
    else handleError({
      ctx,
      message: msg.msg_cn.article_put_fail
    })
  }

  // 修改文章状态 是否私密或者发布
  static async patchArticle(ctx) {
    const _id = ctx.params.id

    const {
      state,
      publish
    } = ctx.request.body

    const querys = {}

    if (state) querys.state = state

    if (publish) querys.publish = publish

    if (!_id) {
      handleError({
        ctx,
        message: msg.msg_cn.invalid_params
      })
      return false
    }

    const res = await Article
      .findOneAndUpdate({ _id }, querys)
      .catch(err => ctx.throw(500, msg.msg_cn.error))
    if (res) handleSuccess({
      ctx,
      message: msg.msg_cn.article_patch_success
    })
    else handleError({
      ctx,
      message: msg.msg_cn.article_patch_fail
    })
  }

  // 获取一篇文章 通过文章id
  static async getArticleProfile(ctx) {
    const _id = ctx.params.id

    if (!_id) {
      handleError({
        ctx,
        message: msg.msg_cn.invalid_params
      })
      return false
    }

    const res = await Article
      .findOne({ _id })
      .populate('tag')
      .catch(err => ctx.throw(500, msg.msg_cn.error))
      console.log(res)
    if (res) {
      res.meta.views += 1
      res.save()
      handleSuccess({
        ctx,
        result: res,
        message: msg.msg_cn.article_get_success
      })
    } else handleError({
      ctx,
      message: msg.msg_cn.article_get_fail
    })
  }

  // 获取文章列表
  static async getArticles(ctx) {

    let { page = 1, limit = 10, keyword = '', state, publish, tag, classify, date, hot } = ctx.query

    // 过滤条件
    const options = {
      sort: { createDate: -1 },
      page: Number(page),
      limit: Number(limit),
      populate: ['tag', 'classify'],
      select: '-content'
    }

    // 参数
    const querys = {}

    // 关键词查询
    if (keyword) {
      const keywordReg = new RegExp(keyword)
      querys['$or'] = [{
          'title': keywordReg
        },
        {
          'content': keywordReg
        },
        {
          'description': keywordReg
        }
      ]
    }

    // 根据 state 查询
    if (state && ['1', '2'].includes(state)) {
      querys.state = state
    }

    // 根据 publish 查询
    if (publish && ['1', '2'].includes(publish)) {
      querys.publish = publish
    }

    // 时间查询
    if (date) {
      const getDate = new Date(date)
      if (!Object.is(getDate.toString(), 'Invalid Date')) {
        // getDate.toString() 如果不是Date实例，则 返回"Invalid Date"
        querys.createDate = {
          '$gte': new Date(getDate),
          '$lt': new Date((getDate / 1000 + 60 * 60 * 24) * 1000)
        }
      }
    }

    // 按 hot 排行
    if (hot) {
      options.sort = {
        'meta.views': -1,
        'meta.likes': -1,
        'meta.comments': -1
      }
    }

    // tag 筛选
    if (tag){
      tag = JSON.parse(tag)
      if(!(tag.length === 1 && !tag[0])) {
        querys.tag = {
          '$all': tag
        }
      }
    }

    // classify 筛选
    if (classify){
      querys.classify = {
        '$all': classify
      }
    }
    // if (classify) querys.classify = classify

    // 查询
    const res = await Article
      .paginate(querys, options)
      .catch(err => ctx.throw(500, msg.msg_cn.error))

    if (res) {
      handleSuccess({
        ctx,
        result: {
          pagination: {
            total: res.total,
            page: res.page,
            limit: res.limit
          },
          list: res.docs
        },
        message: msg.msg_cn.article_get_success
      })
    } else handleError({
      ctx,
      message: msg.msg_cn.article_get_fail
    })

  }

  // 文章归档
  static async getAllArticles(ctx) {

    // 参数
    const querys = {
      state: 1,
      publish: 1
    }

    // 查询
    const res = await Article.aggregate([{
        $match: querys
      },
      {
        $project: {
          year: {
            $year: '$create_at'
          },
          month: {
            $month: '$create_at'
          },
          title: 1,
          create_at: 1
        }
      },
      {
        $group: {
          _id: {
            year: '$year',
            month: '$month'
          },
          article: {
            $push: {
              _id: '$_id',
              title: '$title',
              create_at: '$create_at'
            }
          }
        }
      }
    ])
    if (res) {
      let years = [...new Set(res.map(item => item._id.year))]
        .sort((a, b) => b - a)
        .map(item => {
          let months = []
          res.forEach(n => {
            if (n._id.year === item) {
              months.push({
                month: n._id.month,
                articles: n.article.reverse()
              })
            }
          })
          return {
            year: item,
            months: months.sort((a, b) => b.month - a.month)
          }
        })
      handleSuccess({
        ctx,
        result: years,
        message: msg.msg_cn.article_get_success
      })
    } else {
      handleError({
        ctx,
        message: msg.msg_cn.article_get_fail
      })
    }
  }
}

module.exports = ArticleController