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

    const article = await new Article(ctx.request.body)
                    .save()
                    .catch(err => ctx.throw(500, msg.msg_cn.error))
    if (article) handleSuccess({ ctx, message: msg.msg_cn.article_post_success })
    else handleError({ ctx, message: msg.msg_cn.article_put_fail })
  }

   // 删除文章
  static async deleteArticle (ctx) {
    const _id = ctx.params.id

    if (!_id) {
      handleError({ ctx, message: msg.msg_cn.invalid_params })
      return false
    }
  
    const article = await Article
                      .findOneAndRemove(_id)
                      .catch(err => ctx.throw(500, msg.msg_cn.error))
    if (article) handleSuccess({ ctx, message: msg.msg_cn.article_delete_success })
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
                      .findOneAndUpdate(_id, ctx.request.body)
                      .catch(err => ctx.throw(500, msg.msg_cn.error))
    if (res) handleSuccess({ ctx, message: msg.msg_cn.article_put_success })
    else handleError({ ctx, message: msg.msg_cn.article_put_fail })
  }

  // 修改文章状态
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
                      .findOneAndUpdate(_id, querys)
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
  
    const article = await Article
                      .findOne({ id: _id })
                      .populate('tag')
                      .catch(err => ctx.throw(500, msg.msg_cn.error ))
    if (article) {
      article.meta.views += 1
      article.save()
      handleSuccess({ ctx, result: article, message: msg.msg_cn.article_get_success })
    } else handleError({ ctx, message: msg.msg_cn.article_get_fail })
  }

  // 获取文章列表
  static async getArticles (ctx) {
    // 
  }

  // 文章归档
  static async getAllArticles (ctx) {
    // 
  }
}

module.exports = ArticleController
