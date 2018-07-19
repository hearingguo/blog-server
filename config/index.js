const argv = require('yargs').argv
exports.MONGODB = {
	uri: 'mongodb://127.0.0.1:27017/my_blog',
	username: argv.db_username || 'DB_username',
	password: argv.db_password || 'DB_password'
}

exports.APP = {
	ROOT_PATH: '/api',
	LIMIT: 20,
	PORT: 8000
}