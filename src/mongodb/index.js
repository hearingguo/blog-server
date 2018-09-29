// 数据库模块
const mongoose = require('mongoose')
const config = require('../config')

mongoose.Promise = global.Promise

exports.mongoose = mongoose

// 数据库
exports.connect = () => {

	let db = mongoose.connection

	// 连接数据库
	mongoose.connect(config.MONGODB.uri, { useNewUrlParser: true })

	// 连接错误
	db.on('error', error => {
		console.log(`Mongoose connection error: ${error}`)
	})

	// 连接成功
	db.once('open', () => {
		console.log(`Mongoose connection open to ${config.MONGODB.uri}`)
	})
	
	return mongoose
}