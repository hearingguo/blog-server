
exports.MONGODB = {
	uri: 'mongodb://127.0.0.1:8000/my_blog',
	username: argv.db_username || 'DB_username',
	password: argv.db_password || 'DB_password'
}

exports.APP = {
	ROOT_PATH: '/api',
	LIMIT: 16,
	PORT: 8000
}