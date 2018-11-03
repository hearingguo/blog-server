/**
 * 个人信息数据模型
 */

const mongoose = require('../mongodb').mongoose
const Schema = mongoose.Schema

const authSchema = new Schema({

  // 头像
  avatar: {
    type: String,
    default: ''
  },

  // 用户名
  username: {
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
    default: ''
  }

});

const Auth = mongoose.model('Auth', authSchema)

module.exports = Auth