/* 
*
*  评论
* 
*/

const Article = require('../models/comment')
const msg = require("../config/message")

const {
  handleSuccess,
  handleError
} = require('../utils/handle')

class CommentController {

  // 获取评论
  static async getComments (ctx) {

  }

  // 添加评论
  static async postComment (ctx) {

  }

  // 审核通过评论
  static async putComment (ctx) {

  }

  // 删除评论
  static async deleteComment (ctx) {
    
  }

}

module.exports = CommentController
