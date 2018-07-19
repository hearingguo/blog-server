/**
 * 网站基本信息数据模型
 */

const mongoose = require('../../mongodb').mongoose

const optionSchema = new mongoose.Schema({

	// 网站标题
	title:	{ 
		type: String, 
		required: true
	},

	// 网站副标题
	sub_title:	{ 
		type: String, 
		required: true
	},

	// 关键字
	keywords: { 
		type: String 
	},

	// 网站描述
	description: String,

	// 站点地址
	url: { 
		type: String, 
		required: true 
	},

	// 邮箱
	email: String,

	// 备案号
	icp: String,

	meta: {
    votes: Number,
    favs:  Number
  }

});

const Option = mongoose.model('Option', optionSchema)

module.exports = Option