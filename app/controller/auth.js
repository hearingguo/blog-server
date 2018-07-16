/**
 * 登录
 */

const Auth = require("../model/auth")
const msg = require("../../config/message")

class AuthController {
  
  // 登录
  static async login (ctx) {
    
  }

  // 获取用户信息
  static async getAuth (ctx) {
    const auth = await Auth
                  .findOne({}, 'avatar username name signature')
                  .catch(err => ctx.throw(500, msg.msg_ch.error))
    if (auth) handleSuccess({ ctx, result: auth, message: msg.msg_ch.auth_get_success})    
    else handleError({ ctx, message: msg.msg_ch.auth_get_fail })
    
  }

  // 修改用户信息
  static async putAuth (ctx) {
    const { _id, avatar, username, name, signature, oldPassword, newPassword } = ctx.request.body
    const _auth = await Auth
                  .findOne({}, '_id username signature avatar password')
                  .catch(err => ctx.throw(500, msg.msg_ch.error))
    if (_auth) {
     
    } else handleError({ ctx, message: msg.msg_ch.auth_put_fail })

  }
}

module.exports = AuthController;