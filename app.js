pie = {
	'paths'  : require('./pie/paths').paths,
	'app'    : {
		'models' : {}
	},
	'config' : {}
};

pie.config.app = {
	'core'     : require(pie.paths.app.config.core).core,
	'database' : require(pie.paths.app.config.database).database
};


Inflector  = require(pie.paths.pie.inflector);
Model      = require(pie.paths.pie.model).Model;
Controller = require(pie.paths.pie.controller).Controller;
Sanitize   = require(pie.paths.pie.sanitize);


// Load all the models into pie.app.models
var fs    = require('fs');
var files = fs.readdirSync(pie.paths.app.models);

files.forEach(function(file) {
	var modelName = Inflector.capitalize(file.split('.')[0]);

	if (typeof pie.app.models[modelName] === 'undefined' && ! pie.app.models[modelName]) {
		pie.app.models[modelName] = new Model(require(pie.paths.app.models + modelName.toLowerCase())[modelName]);
	}
});


express = require(pie.paths.pie.modules.express);
server  = express.createServer(
	express.favicon(),
	express.bodyParser(),
	express.cookieParser(),
	express.session({
		secret: pie.config.app.core.secret
	})
);
require(pie.paths.pie.dispatcher).setup();