config      = require('./pie/config').config;
config.core = require(config.paths.sites.config).core;

require(config.paths.pie.inflector).String;

Model      = require(config.paths.pie.model).Model;
Controller = require(config.paths.pie.controller).Controller;
Sanitize   = require(config.paths.pie.sanitize);

express = require(config.paths.pie.modules.express);
server  = express.createServer(
	express.favicon(),
	express.cookieParser(),
	express.session({ secret: config.core.secret }),
	express.bodyParser()
);
require(config.paths.pie.dispatcher).setup();