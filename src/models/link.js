/**
 * 网站基本信息数据模型
 */

const mongoose = require('../mongodb').mongoose
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate')

const linkSchema = new Schema({

  // 友情链接用户
  username: {
    type: String,
    required: true,
    validate: /\S+/
  },

  // 友情链接
  url: {
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
    type: Date
  }

});


// 翻页
linkSchema.plugin(mongoosePaginate)

// 时间更新
linkSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, {
    update_at: Date.now()
  })
  next()
})

const Link = mongoose.model('Link', linkSchema)

module.exports = Link