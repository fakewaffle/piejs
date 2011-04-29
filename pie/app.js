express    = require('express');
fs         = require('fs');
util       = require('util');
events     = require('events');

require('./libs/inflector').String;

dispatcher = require('./dispatcher');
Model      = require('./libs/model/model').Model;
Controller = require('./libs/controller/controller').Controller;

debug  = true;
server = express.createServer();

dispatcher.setup();

server.listen(3000);
console.log('Server running at http://localhost:3000\n');