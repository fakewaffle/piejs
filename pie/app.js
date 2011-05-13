require('./libs/inflector').String;

express    = require('express');
jade       = require('jade');
fs         = require('fs');
util       = require('util');
events     = require('events');

config = require('./config').config;
config.app = {
	'core'     : require(config.paths.app.config.core).core,
	'database' : require(config.paths.app.config.database).database
};
debug = config.app.core.debug;

dispatcher = require(config.paths.pie.dispatcher);
Model      = require(config.paths.pie.model).Model;
Controller = require(config.paths.pie.controller).Controller;
Sanitize   = require(config.paths.pie.sanitize);

server = express.createServer(express.favicon());
server.set('view engine', config.app.core.viewEngine);
server.set('views', __dirname + '/../app/views');

dispatcher.setup();
server.listen(3000);

console.log('Server running at http://localhost:3000\n');