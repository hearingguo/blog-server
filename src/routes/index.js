/**
 * 整合所有路由
 */

const config = require('../config')
const Router = require('koa-router')

const router = new Router()

const api = require('./api')

router.use(config.APP.ROOT_PATH, api.routes(), api.allowedMethods())

module.exports = router