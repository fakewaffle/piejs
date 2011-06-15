exports.paths = {
	'pie' : {
		'boot' : __piedirname + '/pie/boot.js',
		'controller' : {
			'path'       : __piedirname + '/pie/libs/controller/',
			'controller' : __piedirname + '/pie/libs/controller/controller.js'
		},
		'datasource' : {
			'path'  : __piedirname + '/pie/libs/model/datasources/',
			'mysql' : __piedirname + '/pie/libs/model/datasources/mysql.js'
		},
		'dispatcher' : __piedirname + '/pie/dispatcher.js',
		'faker'      : __piedirname + '/pie/node_modules/Faker',
		'inflector'  : __piedirname + '/pie/libs/inflector.js',
		'model'      : __piedirname + '/pie/libs/model/model.js',
		'modules' : {
			'path'    : __piedirname + '/pie/node_modules/',
			'express' : __piedirname + '/pie/node_modules/express',
			'mime'    : __piedirname + '/pie/node_modules/mime',
			'mysql'   : __piedirname + '/pie/node_modules/mysql'
		},
		'sanitize'   : __piedirname + '/pie/libs/sanitize.js',
		'view' : {
			'path'    : __piedirname + '/pie/libs/view/',
			'helpers' : __piedirname + '/pie/libs/view/helpers/'
		}
	},
	'app' : {
		'path' : __piedirname + '/app' + '/',
		'config' : {
			'path'     : __piedirname + '/app/config/',
			'core'     : __piedirname + '/app/config/core.js',
			'database' : __piedirname + '/app/config/database.js',
			'routes'   : __piedirname + '/app/config/routes.js'
		},
		'controllers' : __piedirname + '/app/controllers/',
		'models' : __piedirname + '/app/models/',
		'public' : {
			'path'        : __piedirname + '/app/public/',
			'images'      : __piedirname + '/app/public/images/',
			'javascripts' : __piedirname + '/app/public/javascripts/',
			'stylesheets' : __piedirname + '/app/public/stylesheets/'
		},
		'views' : {
			'path'    : __piedirname + '/app/views',
			'helpers' : __piedirname + '/app/views/helpers/',
			'layouts' : __piedirname + '/app/views/layouts/',
			'pages'   : __piedirname + '/app/views/pages'
		}
	}
};