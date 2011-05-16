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
			'dispatcher' : __dirname + '/dispatcher.js',
			'model'      : __dirname + '/libs/model/model.js',
			'datasource' : {
				'mysql' : __dirname + '/libs/model/datasources/mysql.js'
			},
			'controller' : __dirname + '/libs/controller/controller.js',
			'sanitize'   : __dirname + '/libs/sanitize.js',
			'inflector'  : __dirname + '/libs/inflector.js',
		}
	}
};