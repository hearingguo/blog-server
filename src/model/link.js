/**
 * 网站基本信息数据模型
 */

const mongoose = require('../mongodb').mongoose
const Schema = mongoose.Schema

const linkSchema = new Schema({

	// 友情链接用户
	name:	{ 
		type: String, 
		required: true
  },
  
  // 友情链接
  url: {
    type: String,
    required: true
  }
  
});

const Link = mongoose.model('Option', linkSchema)

module.exports = Link