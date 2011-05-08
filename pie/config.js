exports.config = {
	'paths' : {
		'app' : {
			'path' : __dirname + '/../app',
			'config' : {
				'path'     : __dirname + '/../app/config/',
				'core'     : __dirname + '/../app/config/core.js',
				'database' : __dirname + '/../app/config/database.js'
			},
			'models' : __dirname + '/../app/models/',
			'controllers' : __dirname + '/../app/controllers/',
			'views' : {
				'path'    : __dirname + '/../app/views/',
				'layouts' : __dirname + '/../app/views/layouts/',
			}
		},
		'pie' : {

		}
	}
};