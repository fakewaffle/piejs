pie = {
	'paths'  : require('./pie/paths').paths,
	'config' : require('./pie/config').config,
	'sites'  : {}
};
pie.config.core = require(pie.paths.sites.config).core;

require(pie.paths.pie.inflector).String;

Model      = require(pie.paths.pie.model).Model;
Controller = require(pie.paths.pie.controller).Controller;
Sanitize   = require(pie.paths.pie.sanitize);

var fs    = require('fs');
var files = fs.readdirSync(pie.paths.sites.path);
files.forEach(function(file) {
	if (fs.statSync(pie.paths.sites.path + file).isDirectory() === true) {
		setupSiteConfig(file);
		setupSiteModels(file);
	}
});

function setupSiteConfig(site) {
	pie.paths.sites[site] = {
		'path' : __dirname + '/sites' + site + '/',
		'config' : {
			'path'     : __dirname + '/sites/' + site + '/config/',
			'core'     : __dirname + '/sites/' + site + '/config/core.js',
			'database' : __dirname + '/sites/' + site + '/config/database.js'
		},
		'models' : __dirname + '/sites/' + site + '/models/',
		'controllers' : __dirname + '/sites/' + site + '/controllers/',
		'views' : {
			'path'    : __dirname + '/sites/' + site + '/views',
			'layouts' : __dirname + '/sites/' + site + '/views/layouts/',
			'pages'   : __dirname + '/sites/' + site + '/views/pages'
		},
		'public' : {
			'path'        : __dirname + '/sites/' + site + '/public/',
			'images'      : __dirname + '/sites/' + site + '/public/images/',
			'javascripts' : __dirname + '/sites/' + site + '/public/javascripts/',
			'stylesheets' : __dirname + '/sites/' + site + '/public/stylesheets/'
		}
	};

	pie.config.sites[site] ={
		'core'     : require(pie.paths.sites[site].config.core).core,
		'database' : require(pie.paths.sites[site].config.database).database
	};
}

function setupSiteModels(site) {
	pie.sites[site] = { 'models' : {} };
	var files       = fs.readdirSync(pie.paths.sites[site].models);

	files.forEach(function(file) {
		var modelName = file.split('.')[0].capitalize();

		if (typeof pie.sites[site].models[modelName] === 'undefined' && ! pie.sites[site].models[modelName]) {
			pie.sites[site].models[modelName] = new Model(require(pie.paths.sites[site].models + modelName.toLowerCase())[modelName], site);
		}
	});
}

express = require(pie.paths.pie.modules.express);
server  = express.createServer(
	express.favicon(),
	express.bodyParser(),
	express.cookieParser(),
	express.session({
		secret: pie.config.core.secret
	})
);
require(pie.paths.pie.dispatcher).setup();