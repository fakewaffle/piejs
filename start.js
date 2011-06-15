__piedirname = __dirname;

pie = {
	'paths'  : require('./pie/paths').paths,
	'pie'    : {
		'dataSources' : {},
		'helpers'     : {}
	},
	'app'    : {
		'controllers' : {},
		'helpers'     : {},
		'models'      : {}
	},
	'config' : {}
};

pie.config.app = {
	'core'     : require(pie.paths.app.config.core).core,
	'database' : require(pie.paths.app.config.database).database
};
pie.app.routes = require(pie.paths.app.config.routes).routes;

Inflector  = require(pie.paths.pie.inflector);
Model      = require(pie.paths.pie.model).Model;
Controller = require(pie.paths.pie.controller.controller).Controller;
Sanitize   = require(pie.paths.pie.sanitize);

pie.fs   = require('fs');
pie.sys  = require('sys');
pie.mime = require(pie.paths.pie.modules.mime);

express = require(pie.paths.pie.modules.express);
server  = express.createServer(
	express.favicon(),
	express.bodyParser(),
	express.cookieParser(),
	express.session({
		secret: pie.config.app.core.secret
	})
);

require(pie.paths.pie.boot).boot(function() {
	require(pie.paths.pie.dispatcher).dispatch();
});