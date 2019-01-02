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
	username: argv.auth_default_username || 'hearingguo@gmail.com',
	nickname: argv.auth_default_username || 'highya',
	password: argv.auth_default_password || '123456',
	signature: argv.auth_default_signature || '口袋的温度 是会生长爱的土壤',
	avatar: argv.auth_default_signature || 'https://avatars3.githubusercontent.com/u/7402309?s=400&u=f2f29b4ec7183ee599defd41d1eb9854a11781c9&v=4'
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