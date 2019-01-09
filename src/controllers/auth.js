/**
 * 用户信息
 */

const Auth = require('../models/auth')
const msg = require('../config/message')
const config = require('../config')

const jwt = require('jsonwebtoken')
const crypto = require('crypto')

// md5 编码
const md5Decode = pwd => {
  return crypto
    .createHash('md5')
    .update(pwd)
    .digest('hex')
}

const { handleSuccess, handleError } = require('../utils/handle')

class AuthController {
  // 登录
  static async signin(ctx) {
    const { username = '', password = '' } = ctx.request.body

    const auth = await Auth
      .findOne({ username })
      .catch(err => ctx.throw(500, msg.msg_cn.error))

    if (!auth) {
      handleError({ ctx, message: msg.msg_cn.auth_post_fail_null })
    } else {
      if (md5Decode(password) === auth.password) {
        const token = jwt.sign({
          name: auth.username,
          password: auth.password,
          exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7)
        }, config.AUTH.jwtTokenSecret)
        handleSuccess({ ctx, result: { 
          token, 
          lifeTime: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 7) 
        }, message: msg.msg_cn.auth_post_success })
      } else {
        handleError({ ctx, message: msg.msg_cn.auth_post_fail_error })
      }
    }
  }

  // 获取用户信息
  static async getAuth(ctx) {
    const auth = await Auth
      .findOne({}, 'avatar username nickname signature')
      .catch(err => ctx.throw(500, msg.msg_cn.error))

    if (auth) handleSuccess({ ctx, result: auth, message: msg.msg_cn.auth_get_success })
    else handleError({ ctx, message: msg.msg_cn.auth_get_fail})
  }

  // 修改用户信息
  static async putAuth(ctx) {
    // 更改信息 oldPassword 为必填项
    const { _id, avatar, username, nickname, signature, oldPassword, newPassword } = ctx.request.body
    const auth = await Auth
      .findOne({}, '_id username nickname signature avatar password')
      .catch(err => ctx.throw(500, msg.msg_cn.error))

    if (auth) {
      // 管理员用户存在
      if (auth.password !== md5Decode(oldPassword)) {
        handleError({ ctx, message: msg.msg_cn.auth_put_password_fail })
      }
      let password = md5Decode(newPassword === '' ? oldPassword : newPassword)
      let _auth = await Auth
        .findOneAndUpdate({ _id }, { avatar, username, nickname, signature, password }, {
          new: true
        })
        .catch(err => ctx.throw(500, msg.msg_cn.error))
      if (_auth) handleSuccess({ ctx, result: _auth, message: msg.msg_cn.auth_put_success })
      else handleError({ ctx, message: msg.msg_cn.auth_put_fail })
    } else handleError({ ctx, message: msg.msg_cn.auth_put_fail })
  }
}

module.exports = AuthController;