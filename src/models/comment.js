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
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  // 父留言  0: 默认留言
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
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

  //country,rangecity
  addr: { 
    type: String,
    default: ''
  },

  // 发布日期
  createDate: {
    type: Date,
    default: Date.now
  },

  // 最后修改日期
  updateDate: {
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
    updateDate: Date.now()
  })
  next()
})

// 评论模型
const Comment = mongoose.model('Comment', commentSchema)

// export
module.exports = Comment