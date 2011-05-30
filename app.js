pie = {
	'paths'  : require('./pie/paths').paths,
	'app'    : {},
	'config' : {}
};

pie.config.app = {
	'core'     : require(pie.paths.app.config.core).core,
	'database' : require(pie.paths.app.config.database).database
};

require(pie.paths.pie.inflector).String;

Model      = require(pie.paths.pie.model).Model;
Controller = require(pie.paths.pie.controller).Controller;
Sanitize   = require(pie.paths.pie.sanitize);

(function() {
	var fs    = require('fs');
	var files = fs.readdirSync(pie.paths.app.models);
	pie.app   = { 'models' : {} };

	files.forEach(function(file) {
		var modelName = file.split('.')[0].capitalize();

		if (typeof pie.app.models[modelName] === 'undefined' && ! pie.app.models[modelName]) {
			pie.app.models[modelName] = new Model(require(pie.paths.app.models + modelName.toLowerCase())[modelName]);
		}
	});
})();

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