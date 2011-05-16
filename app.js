config = require('./pie/config').config;
config.app = {
	'core'     : require(config.paths.app.config.core).core,
	'database' : require(config.paths.app.config.database).database
};
debug = config.app.core.debug;

require(config.paths.pie.inflector).String;

Model      = require(config.paths.pie.model).Model;
Controller = require(config.paths.pie.controller).Controller;
Sanitize   = require(config.paths.pie.sanitize);

require(config.paths.pie.dispatcher).setup();
