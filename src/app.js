const koa = require('koa')
const cors = require('koa2-cors')
const http = require('http')
const config = require('./config')
const mongoosePaginate = require('mongoose-paginate')

const mongodb = require('./mongodb')
const router = require('./routes')

const app = new koa()
app.use(cors())

// data secer
mongodb.connect()

mongoosePaginate.paginate.options = {
	limit: config.APP.LIMIT
}

const handler = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.log(err)
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.type = 'html';
    ctx.response.body = '<p>Something wrong, please contact administrator.</p>';
    ctx.app.emit('error', err, ctx);
  }
};

const main = ctx => {
  ctx.throw(500)
}

app.on('error', function(err) {
  console.log('logging error ', err.message);
  console.log(err);
});

app.use(handler)
// app.use(main)


app.listen(27017)