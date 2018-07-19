const koa = require('koa')
const http = require('http')
const config = require('./config')
const mongoosePaginate = require('mongoose-paginate')

const mongodb = require('./mongodb')
const router = require('./route')

const app = new koa()

// data secer
mongodb.connect()

mongoosePaginate.paginate.options = {
	limit: config.APP.LIMIT
}

const main = ctx => {
  console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
  ctx.response.body = 'Hello World1111111';
}

app.use(main)

app.listen(3000)