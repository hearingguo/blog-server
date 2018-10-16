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
  static async postArticle (ctx) {

    const res = await new Article(ctx.request.body)
                    .save()
                    .catch(err => ctx.throw(500, msg.msg_cn.error))
    if (res) handleSuccess({ ctx, message: msg.msg_cn.article_post_success })
    else handleError({ ctx, message: msg.msg_cn.article_put_fail })
  }

   // 删除文章
  static async deleteArticle (ctx) {
    const _id = ctx.params.id

    if (!_id) {
      handleError({ ctx, message: msg.msg_cn.invalid_params })
      return false
    }
  
    const res = await Article
                      .findByIdAndRemove(_id)
                      .catch(err => ctx.throw(500, msg.msg_cn.error))
    if (res) handleSuccess({ ctx, message: msg.msg_cn.article_delete_success })
      else handleError({ ctx, message: msg.msg_cn.article_delete_fail })
  }

  // 修改文章
  static async putArticle (ctx) {
    const _id = ctx.params.id
    
    const { title, keyword } = ctx.request.body

    delete ctx.request.body.create_at
    delete ctx.request.body.update_at
    delete ctx.request.body.meta

    if (!_id) {
      handleError({ ctx, message: msg.msg_cn.invalid_params })
      return false
    }

    if(!title || !keyword)  {
      // title, keyword必填
      handleError({ ctx, message: msg.msg_cn.error_params })
      return false
    }

    const res = await Article
                      .findByIdAndUpdate(_id, ctx.request.body)
                      .catch(err => ctx.throw(500, msg.msg_cn.error))
    if (res) handleSuccess({ ctx, message: msg.msg_cn.article_put_success })
    else handleError({ ctx, message: msg.msg_cn.article_put_fail })
  }

  // 修改文章状态 是否私密或者发布
  static async patchArticle (ctx) {
    const _id = ctx.params.id
    
    const { state, publish } = ctx.request.body
  
    const querys = {}
  
    if (state) querys.state = state
  
    if (publish) querys.publish = publish
    
    if (!_id) {
      handleError({ ctx, message: msg.msg_cn.invalid_params })
      return false
    }
  
    const res = await Article
                      .findByIdAndUpdate(_id, querys)
                      .catch(err => ctx.throw(500, msg.msg_cn.error))
    if (res) handleSuccess({ ctx, message: msg.msg_cn.article_patch_success })
    else handleError({ ctx, message: msg.msg_cn.article_patch_fail })
  }

  // 获取一篇文章 通过文章id
  static async getArticleProfile (ctx) {
    const _id = ctx.params.id
    
    if (!_id) {
      handleError({ ctx, message: msg.msg_cn.invalid_params })
      return false
    }
  
    const res = await Article
                      .findById(_id)
                      .populate('tag')
                      .catch(err => ctx.throw(500, msg.msg_cn.error ))
    if (res) {
      res.meta.views += 1
      res.save()
      handleSuccess({ ctx, result: res, message: msg.msg_cn.article_get_success })
    } else handleError({ ctx, message: msg.msg_cn.article_get_fail })
  }

  // 获取文章列表
  static async getArticles (ctx) {
    
    const {
      current_page = 1,
      page_size = 10,
      keyword = '',
      state = 1,
      publish = 1,
      tag,
      type,
      date,
      hot 
    } = ctx.query

    // 过滤条件
    const options = {
      sort: { create_at: -1 },
      page: Number(current_page),
      limit: Number(page_size),
      populate: ['tag'],
      select: '-content'
    }

    // 参数
    const querys = {}

    // 关键词查询
    if (keyword) {
      const keywordReg = new RegExp(keyword)
      querys['$or'] = [
        { 'title': keywordReg },
        { 'content': keywordReg },
        { 'description': keywordReg }
      ]
    }

    // 根据 state 查询
    if (['1', '2'].includes(state)) {
      querys.state = state
    }
  
    // 根据 publish 查询
    if (['1', '2'].includes(publish)) {
      querys.publish = publish
    }
  
    // 按照 type 查询
    if (['1', '2', '3'].includes(type)) {
      querys.type = type
    }

    // 时间查询
    if (date) {
      const getDate = new Date(date)
      if(!Object.is(getDate.toString(), 'Invalid Date')) {
        // getDate.toString() 如果不是Date实例，则 返回"Invalid Date"
        querys.create_at = {
          "$gte": new Date(getDate),
          "$lt": new Date((getDate / 1000 + 60 * 60 * 24) * 1000)
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
    if (tag) querys.tag = tag

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
            current_page: res.page,
            total_page: res.pages,
            page_size: res.limit
          },
          list: res.docs
        },
        message: msg.msg_cn.article_get_success
      })
    } else handleError({ ctx, message: msg.msg_cn.article_get_fail })

  }

  // 文章归档
  static async getAllArticles (ctx) {

    // 参数
    const querys = {
      state: 1,
      publish: 1
    }

    // 查询
    const res = await Article.aggregate([
                          { 
                            $match: querys 
                          },
                          {
                            $project: {
                              year: { $year: '$create_at' },
                              month: { $month: '$create_at' },
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
                            months.push({ month: n._id.month, articles: n.article.reverse() })
                          }
                        })
                        return { year: item, months: months.sort((a, b) => b.month - a.month)}
                      })
      handleSuccess({ ctx, result: years, message: msg.msg_cn.article_get_success })
    }
    else {
      handleError({ ctx, message: msg.msg_cn.article_get_fail })
    } 
  }
}

module.exports = ArticleController
