/**
 * 个人信息数据模型
 */

const mongoose = require('../../mongodb').mongoose

const optionSchema = new mongoose.Schema({

	// 头像
	avatar:	{ 
    type: String, 
    default: '' 
  },

	// 用户名
	username:	{ 
    type: String, 
    default: '' 
  },

	// 昵称
	name: { 
    type: String, 
    default: '' 
  },

	// 个性签名
	signature: { 
    type: String, 
    default: '' 
  },

  // 密码
  password: { 
    type: String, 
    default: '' },
	
});

const Option = mongoose.model('Auth', optionSchema)

module.exports = Option