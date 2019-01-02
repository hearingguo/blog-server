/*  
 *
 *  评论数据模型
 *
 */

const mongoose = require('../mongodb').mongoose
const mongoosePaginate = require('mongoose-paginate')

const commentSchema = new mongoose.Schema({

  // user
  commentator: {
    name: {
      type: String,
      required: true,
      validate: /\S+/
    },
    email: {
      type: String,
      required: true,
      validate: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
    },
    site: {
      type: String,
      validate: /^((https|http):\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/
    }
  },

  // 文章id
  post_id: {
    type: Number,
    required: true
  },

  // 父留言  0: 默认留言
  parent_id: {
    type: Number,
    default: 0
  },

  // content
  content: {
    type: String,
    required: true,
    validate: /\S+/
  },

  // 被赞数
  likes: {
    type: Number,
    default: 0
  },

  // 用户ua
  agent: {
    type: String,
    validate: /\S+/
  },

  // 状态 0待审核 1通过正常 2不通过
  state: {
    type: Number,
    default: 1
  },

  // ip
  ip: {
    type: String
  },

  addr: { //country,rangecity
    type: String,
    default: ''
  },

  // 发布日期
  create_at: {
    type: Date,
    default: Date.now
  },

  // 最后修改日期
  update_at: {
    type: Date
  }

})

// 转化成普通 JavaScript 对象
commentSchema.set('toObject', {
  getters: true
})

// 翻页
commentSchema.plugin(mongoosePaginate)

// 时间更新
commentSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, {
    update_at: Date.now()
  })
  next()
})

// 评论模型
const Comment = mongoose.model('Comment', commentSchema)

// export
module.exports = Comment