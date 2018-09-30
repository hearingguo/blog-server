/**
 * 整合所有路由
 */

const config = require('../config')
const Router = require('koa-router')

const router = new Router()

const api = require('./api')

// const router = new Router({
//   prefix: config.APP.ROOT_PATH
// })

router.use('/api', api.routes(), api.allowedMethods())

module.exports = router