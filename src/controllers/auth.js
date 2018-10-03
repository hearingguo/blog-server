/**
 * 用户信息
 */

const Auth = require("../models/auth")
const msg = require("../config/message")

const {
  handleSuccess,
  handleError
} = require("../utils/handle")

class AuthController {
  // 登录
  static async signin (ctx) {
    const { username = '', password = '' } = ctx.request.body

    const auth = await Auth
                  .findOne({ username })
                  .catch(err => ctx.throw(500, msg.msg_cn.error))
                  handleError({ ctx, message: auth })
    if(!auth) {
      handleError({ ctx, message: msg.msg_cn.auth_post_fail_null })
    } else {
      if(password === auth.password) {
        handleSuccess({ ctx, message: msg.msg_cn.auth_post_success })
      } else {
        handleError({ ctx, message: msg.msg_cn.auth_post_fail_error })
      }
    }
  }

  // 获取用户信息
  static async getAuth (ctx) {
    const auth = await Auth
                  .findOne({}, 'avatar username name signature')
                  .catch(err => ctx.throw(500, msg.msg_cn.error))
    if(auth) handleSuccess({ ctx, result: auth, message: msg.msg_cn.auth_get_success})
    else handleError({ ctx, message: msg.msg_cn.auth_get_fail })
  }

  // 修改用户信息
  static async putAuth (ctx) {
    const { _id, avatar, username, name, signature, oldPassword, newPassword } = ctx.request.body
    const auth = await Auth
                  .findOne({}, '_id username signature avatar password')
                  .catch(err => ctx.throw(500, msg.msg_cn.error))
    if(auth) {
      if(auth.password !== oldPassword) {
        handleError({ ctx, message: msg.msg_cn.auth_put_password_fail })
      } else {
        let password = newPassword === '' ? oldPassword : newPassword
        let _auth = await Auth
                      .findByIdAndUpdate(_id, { _id, avatar, username, name, signature, password }, { new: true })
                      .catch(err => ctx.throw(500, msg.msg_cn.error))
        if(_auth) handleSuccess({ ctx, result: auth, message: msg.msg_cn.auth_put_success})
        else handleError({ ctx, message: msg.msg_cn.auth_put_fail })
      }
    } else handleError({ ctx, message: msg.msg_cn.auth_put_fail })
  }
}

module.exports = AuthController;