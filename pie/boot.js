exports.boot = function(callback) {
	loadDataSources();
	loadModels();
	loadControllers();
	loadPieHelpers();
	loadAppHelpers();

	callback();
}

/**
 * Load all the dataSources into pie.pie.dataSources.
 *
 * @author Justin Morris
 * @created 2011-06-14 18.18.37
 */
var loadDataSources = function() {
	var files = pie.fs.readdirSync(pie.paths.pie.datasource.path);

	files.forEach(function(file) {
		if (file.split('.')[1] === 'js') {
			var dataSourceFileName = file.split('.')[0];
			var dataSourceName     = [Inflector.camelize(dataSourceFileName)];
			var dataSourceExport   = require(pie.paths.pie.datasource.path + dataSourceFileName);

			pie.pie.dataSources[dataSourceName] = dataSourceExport[dataSourceName];
		}
	});
}

/**
 * Load all the models in /piejs/app/models into pie.app.models.
 *
 * We only want to load the models once, so we load them (with blocking!)
 * when the app starts. All references to the models (such as hasMany,
 * belongsTo, hasAndBelongsToMany) will refer to pie.app.models[name].
 *
 * @author Justin Morris
 * @created 2011-06-02 19.43.48
 */
var loadModels = function() {
	var files = pie.fs.readdirSync(pie.paths.app.models);

	files.forEach(function(file) {
		if (file.split('.')[1] === 'js') {
			var modelFileName = file.split('.')[0];
			var modelName     = Inflector.classify(modelFileName);
			var modelExports  = require(pie.paths.app.models + modelFileName);
			var model         = modelExports[modelName];

			// We are actually creating a new object of the Model, unlike dataSources, controllers, and helpers
			pie.app.models[modelName] = new Model(model);

			for (var i in modelExports) {
				var modelExport = modelExports[i];

				if (typeof modelExport === 'function') {
					pie.app.models[modelName][i] = modelExport;
				}
			}
		}
	});
}

/**
 * Load the names of the controllers in /piejs/app/controllers into pie.app.controllers
 *
 * Dispatcher will test whether a called controller is available.
 *
 * @author Justin Morris
 * @created 2011-06-13 16.11.38
 */
var loadControllers = function() {
	var files = pie.fs.readdirSync(pie.paths.app.controllers);

	files.forEach(function(file) {
		if (file.split('.')[1] === 'js') {
			var controllerFileName = file.split('.')[0];
			var controllerName     = Inflector.camelize(controllerFileName);
			var controller         = require(pie.paths.app.controllers + controllerFileName);

			pie.app.controllers[controllerName] = controller;
		}

	});

	if (typeof pie.app.controllers.PagesController === 'undefined') {
		pie.app.controllers.PagesController = require(pie.paths.pie.controller.path + 'pages_controller');
	}
}

/**
 * Load the names of the helpers for Pie that are located in /piejs/pie/view/helpers/
 *
 * @author Justin Morris
 * @created 2011-06-13 16.49.17
 */
var loadPieHelpers = function() {
	var files = pie.fs.readdirSync(pie.paths.pie.view.helpers);

	files.forEach(function(file) {
		if (file.split('.')[1] === 'js') {
			var helperFileName = file.split('.')[0];
			var helperName     = Inflector.camelize(helperFileName);
			var helper         = require(pie.paths.pie.view.helpers + helperFileName);

			pie.pie.helpers[helperName] = helper[helperName];
		}
	});
}

/**
 * Load the names of the helpers for the App that are located in /piejs/app/views/helpers/
 *
 * @author Justin Morris
 * @created 2011-06-13 16.58.17
 */
var loadAppHelpers = function() {
	var files = pie.fs.readdirSync(pie.paths.app.views.helpers);

	files.forEach(function(file) {
		if (file.split('.')[1] === 'js') {
			var helperFileName = file.split('.')[0];
			var helperName     = Inflector.camelize(helperFileName);
			var helper         = require(pie.paths.app.views.helpers + helperFileName);

			pie.app.helpers[helperName] = helper[helperName];
		}
	});
}