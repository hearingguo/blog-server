/*  
 *
 *  文章数据模型
 *
 */

const mongoose = require('../mongodb').mongoose
const mongoosePaginate = require('mongoose-paginate')

const articleSchema = new mongoose.Schema({

  // 文章标题
  title: {
    type: String,
    required: true
  },

  // 关键字
  keyword: {
    type: String,
    required: true
  },

  // 缩略图
  thumb: {
    type: String,
    required: true
  },

  // 描述
  description: {
    type: String,
    required: false
  },

  // 内容
  content: {
    type: String,
    required: true
  },

  // 分类
  // ref指向 Classify Schema
  classify: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classify'
  },

  // 标签
  // ref指向 Tag Schema
  tag: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],

  // 状态： 1 发布 2 草稿
  state: {
    type: Number,
    default: 2
  },

  // 文章公开状态： 1 公开 2 私密
  publish: {
    type: Number,
    default: 2
  },

  // 缩略图
  thumb: {
    type: String,
    required: true
  },

  // 发布日期
  createDate: {
    type: Date,
    default: Date.now
  },

  // 最后修改日期
  updateDate: {
    type: Date,
    default: Date.now
  },

  // 其他元信息
  meta: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    }
  }
})

// 转化成普通 JavaScript 对象
articleSchema.set('toObject', {
  getters: true
})

// 翻页
articleSchema.plugin(mongoosePaginate)

// 时间更新
articleSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, {
    updateDate: Date.now()
  })
  next()
})

// 文章模型
const Article = mongoose.model('Article', articleSchema)

// export
module.exports = Article