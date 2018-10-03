const argv = require('yargs').argv

exports.MONGODB = {
	uri: 'mongodb://127.0.0.1:27017/blog',
	username: '',
	password: ''
}

exports.APP = {
	ROOT_PATH: '/api',
	LIMIT: 20,
	PORT: 8000
}