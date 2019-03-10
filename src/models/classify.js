/**
 * 文章分类数据模型
 */

const mongoose = require('../mongodb').mongoose
const Schema = mongoose.Schema
const mongoosePaginate = require('mongoose-paginate')

// 分类模型
const ClassifySchema = new Schema({

  // 分类名称
  title: {
    type: String,
    required: true,
    validate: /\S+/
  },

  // 名称
  name: {
    type: String,
    required: true,
    validate: /\S+/
  },

  // 分类描述
  description: String,

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


// 翻页
ClassifySchema.plugin(mongoosePaginate)

// 时间更新
ClassifySchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, {
    updateDate: Date.now()
  })
  next()
})


const Classify = mongoose.model('Classify', ClassifySchema)

module.exports = Classify