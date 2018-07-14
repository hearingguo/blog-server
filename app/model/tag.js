/**
* 标签数据模型
*/

const mongoose = require('../../mongodb').mongoose

// 标签模型
const tagSchema = new mongoose.Schema({

	// 标签名称
	name: { 
    type: String, 
    required: true, 
    validate: /\S+/ 
  },

	// 标签描述
  description: String,
  
  // 文章相关数
  count: Number

},{ 
  timestamps: true
})

const Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag