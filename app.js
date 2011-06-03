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


/**
 * Load all the models in /piejs/app/models into pie.app.models.
 *
 * We only want to load the models once, so we load them (with blocking!)
 * when the app starts. All references to the models (such as hasMany,
 * belongsTo, hasAndBelongsToMany) will refer 
 *
 * 2011-06-02 19.43.48 - Justin Morris
 */
(function() {
	var fs    = require('fs');
	var files = fs.readdirSync(pie.paths.app.models);

	files.forEach(function(file) {
		var modelName    = Inflector.capitalize(file.split('.')[0]);
		var modelExports = require(pie.paths.app.models + modelName.toLowerCase());
		var model        = modelExports[modelName];

		pie.app.models[modelName] = new Model(model);

		for (var i in modelExports) {
			var modelExport = modelExports[i];

			if (typeof modelExport === 'function') {
				pie.app.models[modelName][i] = modelExport;
			}
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