exports.paths = {
	'pie' : {
		'modules' : {
			'path'    : __dirname + '/node_modules/',
			'express' : __dirname + '/node_modules/express',
			'mime'    : __dirname + '/node_modules/mime',
			'mysql'   : __dirname + '/node_modules/mysql'
		},
		'dispatcher' : __dirname + '/dispatcher.js',
		'model'      : __dirname + '/libs/model/model.js',
		'datasource' : {
			'path'  : __dirname + '/libs/model/datasources/',
			'mysql' : __dirname + '/libs/model/datasources/mysql.js'
		},
		'controller' : __dirname + '/libs/controller/controller.js',
		'view' : {
			'path'    : __dirname + '/libs/view/',
			'helpers' : __dirname + '/libs/view/helpers/',
		},
		'sanitize'   : __dirname + '/libs/sanitize.js',
		'inflector'  : __dirname + '/libs/inflector.js',
		'faker'      : __dirname + '/node_modules/Faker'
	},
	'app' : {
		'path' : __dirname + '/../app' + '/',
		'config' : {
			'path'     : __dirname + '/../app/config/',
			'core'     : __dirname + '/../app/config/core.js',
			'database' : __dirname + '/../app/config/database.js'
		},
		'models' : __dirname + '/../app/models/',
		'controllers' : __dirname + '/../app/controllers/',
		'views' : {
			'path'    : __dirname + '/../app/views',
			'layouts' : __dirname + '/../app/views/layouts/',
			'pages'   : __dirname + '/../app/views/pages',
			'helpers' : __dirname + '/../app/views/helpers/'
		},
		'public' : {
			'path'        : __dirname + '/../app/public/',
			'images'      : __dirname + '/../app/public/images/',
			'javascripts' : __dirname + '/../app/public/javascripts/',
			'stylesheets' : __dirname + '/../app/public/stylesheets/'
		}
	}
};