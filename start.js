__piedirname = __dirname;

pie = {
	'paths'  : require('./pie/paths').paths,
	'pie'    : {
		'availableHelpers' : []
	},
	'app'    : {
		'models'               : {},
		'availableControllers' : [],
		'availableHelpers'     : []
	},
	'config' : {}
};

pie.config.app = {
	'core'     : require(pie.paths.app.config.core).core,
	'database' : require(pie.paths.app.config.database).database
};

Inflector  = require(pie.paths.pie.inflector);
Model      = require(pie.paths.pie.model).Model;
Controller = require(pie.paths.pie.controller.controller).Controller;
Sanitize   = require(pie.paths.pie.sanitize);

var fs = require('fs');

/**
 * Load all the models in /piejs/app/models into pie.app.models.
 *
 * We only want to load the models once, so we load them (with blocking!)
 * when the app starts. All references to the models (such as hasMany,
 * belongsTo, hasAndBelongsToMany) will refer to pie.app.models[name].
 *
 * 2011-06-02 19.43.48 - Justin Morris
 */
(function() {
	var files = fs.readdirSync(pie.paths.app.models);

	files.forEach(function(file) {
		var modelFileName = file.split('.')[0];
		var modelName     = Inflector.classify(modelFileName);
		var modelExports  = require(pie.paths.app.models + modelFileName);
		var model         = modelExports[modelName];

		pie.app.models[modelName] = new Model(model);

		for (var i in modelExports) {
			var modelExport = modelExports[i];

			if (typeof modelExport === 'function') {
				pie.app.models[modelName][i] = modelExport;
			}
		}
	});
})();

/**
 * Load the names of the controllers in /piejs/app/controllers into pie.app.controllers
 *
 * Dispatcher will test whether a called controller is available.
 *
 * 2011-06-13 16.11.38 - Justin Morris
 */
(function() {
	var files = fs.readdirSync(pie.paths.app.controllers);

	files.forEach(function(file) {
		var controllerFileName = file.split('.')[0];
		var controllerName     = Inflector.camelize(controllerFileName);

		pie.app.availableControllers.push(controllerName);
	});
})();

/**
 * Load the names of the helpers for Pie that are located in /piejs/pie/view/helpers/
 *
 * 2011-06-13 16.49.17 - Justin Morris
 */
(function() {
	var files = fs.readdirSync(pie.paths.pie.view.helpers);

	files.forEach(function(file) {
		var helperFileName = file.split('.')[0];
		var helperName     = Inflector.camelize(helperFileName);

		pie.pie.availableHelpers.push(helperName);
	});
})();

/**
 * Load the names of the helpers for the App that are located in /piejs/app/views/helpers/
 *
 * 2011-06-13 16.58.17 - Justin Morris
 */
(function() {
	var files = fs.readdirSync(pie.paths.app.views.helpers);

	files.forEach(function(file) {
		var helperFileName = file.split('.')[0];
		var helperName     = Inflector.camelize(helperFileName);

		pie.app.availableHelpers.push(helperName);
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