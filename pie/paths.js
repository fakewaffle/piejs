exports.paths = {
	'pie' : {
		'controller' : __dirname + '/libs/controller/controller.js',
		'datasource' : {
			'path'  : __dirname + '/libs/model/datasources/',
			'mysql' : __dirname + '/libs/model/datasources/mysql.js'
		},
		'dispatcher' : __dirname + '/dispatcher.js',
		'faker'      : __dirname + '/node_modules/Faker',
		'inflector'  : __dirname + '/libs/inflector.js',
		'model'      : __dirname + '/libs/model/model.js',
		'modules' : {
			'path'    : __dirname + '/node_modules/',
			'express' : __dirname + '/node_modules/express',
			'mime'    : __dirname + '/node_modules/mime',
			'mysql'   : __dirname + '/node_modules/mysql'
		},
		'sanitize'   : __dirname + '/libs/sanitize.js',
		'view' : {
			'path'    : __dirname + '/libs/view/',
			'helpers' : __dirname + '/libs/view/helpers/'
		}
	},
	'app' : {
		'path' : __dirname + '/../app' + '/',
		'config' : {
			'path'     : __dirname + '/../app/config/',
			'core'     : __dirname + '/../app/config/core.js',
			'database' : __dirname + '/../app/config/database.js',
			'routes'   : __dirname + '/../app/config/routes.js'
		},
		'controllers' : __dirname + '/../app/controllers/',
		'models' : __dirname + '/../app/models/',
		'public' : {
			'path'        : __dirname + '/../app/public/',
			'images'      : __dirname + '/../app/public/images/',
			'javascripts' : __dirname + '/../app/public/javascripts/',
			'stylesheets' : __dirname + '/../app/public/stylesheets/'
		},
		'views' : {
			'path'    : __dirname + '/../app/views',
			'helpers' : __dirname + '/../app/views/helpers/',
			'layouts' : __dirname + '/../app/views/layouts/',
			'pages'   : __dirname + '/../app/views/pages'
		}
	}
};