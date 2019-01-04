const Router = require('koa-router')
const controller = require('../controllers')

const router = new Router()

// Api
const routers = router
  .get('/auth', controller.auth.getAuth) // 获取用户信息
  .put('/auth', controller.auth.putAuth) // 修改用户信息
  .post('/signin', controller.auth.signin) // 登录		

  .get('/option', controller.option.getOption) // 获取网站基本信息
  .put('/option', controller.option.putOption) // 修改网站信息

  .get('/tag', controller.tag.getTags) // 获取标签
  .post('/tag', controller.tag.postTag) // 添加标签
  .put('/tag/:id', controller.tag.putTag) // 修改标签
  .delete('/tag/:id', controller.tag.deleteTag) // 删除标签

  .get('/classify', controller.classify.getClassify) // 获取分类
  .post('/classify', controller.classify.postClassify) // 添加分类
  .put('/classify/:id', controller.classify.putClassify) // 修改分类
  .delete('/classify/:id', controller.classify.deleteClassify) // 删除分类

  .get('/article', controller.article.getArticles) // 文章列表
  .post('/article', controller.article.postArticle) // 添加文章
  .get('/article/:id', controller.article.getArticleProfile) // 文章详情
  .patch('/article/:id', controller.article.patchArticle) // 修改文章状态
  .put('/article/:id', controller.article.putArticle) // 修改文章
  .delete('/article/:id', controller.article.deleteArticle) // 删除文章
  .get('/allArticle', controller.article.getAllArticles) // 文章归档

  .get('/comment', controller.comment.getComments) // 评论列表
  .post('/comment', controller.comment.postComment) // 添加评论
  .put('/comment/:id', controller.comment.putComment) // 通过评论
  .delete('/comment/:id', controller.comment.deleteComment) // 删除评论

  .post('/like', controller.like.postLike) // 喜欢文章

  .get('/link', controller.link.getLinks) // 获取友链列表
  .post('/link', controller.link.postLink) // 添加友链
  .put('/link/:id', controller.link.putLink) // 修改友链
  .delete('/link/:id', controller.link.deleteLink) // 删除友链

module.exports = routers