/**
 * 网站基本信息数据模型
 */

const mongoose = require('../mongodb').mongoose
const Schema = mongoose.Schema

const autoIncrement = require('mongoose-auto-increment')
const mongoosePaginate = require('mongoose-paginate')

// 自增ID初始化
autoIncrement.initialize(mongoose.connection)

const linkSchema = new Schema({

  // 友情链接用户
  name: {
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
  create_at: {
    type: Date,
    default: Date.now
  },

  // 最后修改日期
  update_at: {
    type: Date
  }

});


// 翻页
linkSchema.plugin(mongoosePaginate)
linkSchema.plugin(autoIncrement.plugin, {
  model: 'Link',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// 时间更新
linkSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, {
    update_at: Date.now()
  })
  next()
})

const Link = mongoose.model('Link', linkSchema)

module.exports = Link