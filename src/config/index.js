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

exports.AUTH = {
	jwtTokenSecret: argv.auth_key || 'blog',
	defaultUsername: argv.auth_default_username || 'highya',
	defaultPassword: argv.auth_default_password || '123456'
}

exports.OPTION = {
		defaultTitle: 'highya | blog',
		defaultSub_title: '口袋里的温度 是会生长爱的土壤',
		defaultEmail: 'hearingguo@gmail.com',
		defaultUrl: 'http://www.highya.com/'
}

exports.EMAIL = {
	account: argv.EMAIL_account || 'your_email_account',
	password: argv.EMAIL_password || 'your_email_password'
}