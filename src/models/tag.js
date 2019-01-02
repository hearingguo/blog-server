/**
 * 标签数据模型
 */

const mongoose = require('../mongodb').mongoose
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate')

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

// 时间更新
tagSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, {
    update_at: Date.now()
  })
  next()
})


const Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag