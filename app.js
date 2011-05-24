pie = {
	'config' : require('./pie/config').config,
	'sites' : {}
};
pie.config.core = require(pie.config.paths.sites.config).core;

require(pie.config.paths.pie.inflector).String;

Model      = require(pie.config.paths.pie.model).Model;
Controller = require(pie.config.paths.pie.controller).Controller;
Sanitize   = require(pie.config.paths.pie.sanitize);

var fs    = require('fs');
var files = fs.readdirSync(pie.config.paths.sites.path);
files.forEach(function(file) {
	if (fs.statSync(pie.config.paths.sites.path + file).isDirectory() === true) {
		setupSiteConfig(file);
		setupSiteModels(file);
	}
});

express = require(pie.config.paths.pie.modules.express);
server  = express.createServer(
	express.favicon(),
	express.bodyParser(),
	express.cookieParser(),
	express.session({
		secret: pie.config.core.secret
	})
);
require(pie.config.paths.pie.dispatcher).setup();

function setupSiteConfig(site) {
	pie.config.paths.sites[site] = {
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
		'core'     : require(pie.config.paths.sites[site].config.core).core,
		'database' : require(pie.config.paths.sites[site].config.database).database
	};
}

function setupSiteModels(site) {
	pie.sites[site] = {
		'models' : {}
	};
	var files = fs.readdirSync(pie.config.paths.sites[site].models);

	files.forEach(function(file) {
		var modelName = file.split('.')[0].capitalize();

		if (typeof pie.sites[site].models[modelName] === 'undefined' && ! pie.sites[site].models[modelName]) {
			var model                         = require(pie.config.paths.sites[site].models + modelName.toLowerCase())[modelName];
			pie.sites[site].models[modelName] = new Model(model, site);
		}
	});
}