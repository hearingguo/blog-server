const koa = require('koa')
const cors = require('koa2-cors')
const config = require('./config')
const mongoosePaginate = require('mongoose-paginate')

const mongodb = require('./mongodb')
const router = require('./routes')
const koaBody = require('koa-body')

const app = new koa()

// data secer
mongodb.connect()

mongoosePaginate.paginate.options = {
	limit: config.APP.LIMIT
}

// const handler = async (ctx, next) => {
//   try {
//     await next()
//   } catch (err) {
//     ctx.response.status = err.statusCode || err.status || 500
//     ctx.response.type = 'html'
//     ctx.response.body = '<p>Something wrong, please contact administrator.</p>'
//     // ctx.app.emit('error', err, ctx)
//   }
// }

// app.on('error', function(err) {
//   console.log('logging error ', err.message)
// })
app.use(cors())
app.use(koaBody({
  jsoinLimit: '10mb',
  formLimit: '10mb',
  textLimit: '10mb'
}))
app.use(router.routes())

// app.use(handler)

app.listen(8000, () => {
  console.log('app start 8000')
})
