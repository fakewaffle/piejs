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
		'views' : {
			'path'    : __dirname + '/libs/view/',
			'helpers' : __dirname + '/libs/view/helpers/',
		},
		'sanitize'   : __dirname + '/libs/sanitize.js',
		'inflector'  : __dirname + '/libs/inflector.js',
		'faker'      : __dirname + '/node_modules/Faker'
	},
	'sites' : {
		'path'   : __dirname + '/../sites/',
		'config' : __dirname + '/../sites/config.js'
	}
};