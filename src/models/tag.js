/**
 * 标签数据模型
 */

const mongoose = require('../mongodb').mongoose
const Schema = mongoose.Schema

const autoIncrement = require('mongoose-auto-increment')
const mongoosePaginate = require('mongoose-paginate')

// 自增ID初始化
autoIncrement.initialize(mongoose.connection)

// 标签模型
const tagSchema = new Schema({

  // 标签名称
  name: {
    type: String,
    required: true,
    validate: /\S+/
  },

  // 标签描述
  description: String,

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


// 翻页
tagSchema.plugin(mongoosePaginate)
tagSchema.plugin(autoIncrement.plugin, {
  model: 'Link',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// 时间更新
tagSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, {
    update_at: Date.now()
  })
  next()
})


const Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag