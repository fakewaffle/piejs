require('./libs/inflector').String;

express    = require('express');
jade       = require('jade');
fs         = require('fs');
util       = require('util');
events     = require('events');
dispatcher = require('./dispatcher');
Model      = require('./libs/model/model').Model;
Controller = require('./libs/controller/controller').Controller;

debug      = true;
server     = express.createServer();

server.set('view engine', 'jade');
server.set('views', __dirname + '/../app/views');

dispatcher.setup();

server.listen(3000);
console.log('Server running at http://localhost:3000\n');