/**
 * Creates a controller in which a users controller will inherit from.
 *
 * Controller will use its model (and related models), and provide the model's
 * standard methods to find and save data in a data source agnostic way.
 *
 * @param object params Parameters for the controller (name, helpers)
 *
 * 2011-05-17 23.16.13 - Justin Morris
 */
function Controller(params) {
	var self              = this;
	this.name             = params.name;
	this[this.name]       = pie.app.models[this.name];
	this.webroot          = pie.config.app.core.webroot;
	this.requestedHelpers = params.helpers;
	this.helpers          = {};

	if (typeof this[this.name].belongsTo !== 'undefined' && this[this.name].belongsTo) {
		Object.keys(self[self.name].belongsTo).forEach(function(key) {
			self[self.name][key] = pie.app.models[key];
		});
	}

	if (typeof this[this.name].hasMany !== 'undefined' && this[this.name].hasMany) {
		Object.keys(self[self.name].hasMany).forEach(function(key) {
			self[self.name][key] = pie.app.models[key];
		});
	}

	if (typeof this.requestedHelpers !== 'undefined' && this.requestedHelpers) {
		Object.keys(self.requestedHelpers).forEach(function(key) {
			var requestedHelper = self.requestedHelpers[key];
			var helperFile      = Inflector.underscore(requestedHelper) + '.js';
			var Helper          = null;
			var PieHelper       = null;
			var SiteHelper      = null;

			// Try to load the Helper form the Pie core - piejs/pie/libs/view/helpers/
			try { PieHelper  = require(pie.paths.pie.view.helpers  + helperFile); } catch(e) {}
			if (PieHelper) { Helper  = PieHelper[requestedHelper]; }

			// Try to load the Helper from the app - piejs/app/views/helpers/
			try { SiteHelper = require(pie.paths.app.views.helpers  + helperFile); } catch(e) {}
			if (SiteHelper) { Helper = SiteHelper[requestedHelper]; }

			self.helpers[requestedHelper] = new Helper(self.name);
		});
	}
	this.helpers.Sanitize  = Sanitize;
	this.helpers.Inflector = Inflector;
}

/**
 * Sets the variables to the view, and renders the view for the requester.
 *
 * @param Object request Request object from express
 * @param Object response Response object from express
 * @param Object results Data to send to the view
 *
 * 2011-05-17 23.20.50 - Justin Morris
 */
Controller.prototype.set = function(request, response, results, layout) {
	var	params     = request.params;
	var controller = params.controller;
	var action     = params.action;
	var results    = results;
	var layout     = layout;

	if (typeof results === 'undefined') {
		results = {};
	}
	results.flash = request.flash();

	if (typeof layout === 'undefined') {
		layout = 'default';
	}

	var responseParams = {
		'layout'  : pie.paths.app.views.layouts + layout + '.' + pie.config.app.core.viewEngine,
		'locals'  : results,
		'pie' : {
			'Helper' : this.helpers
		}
	};

	server.set('views', pie.paths.app.views.path);
	server.set('view engine', pie.config.app.core.viewEngine);

	response.render(controller + '/' + action, responseParams);
}

/**
 * Convenience wrapper of express redirect with PieJS conventions.
 *
 * @param object response Response object from express
 * @param object OR string params If params is an object, construct the link with convention and passed params. If params is a string use it for the link.
 *
 * 2011-05-30 09.13.41 - Justin Morris
 */
Controller.prototype.redirect = function(response, params) {
	var link = this.webroot;

	if (typeof params === 'object') {
		var controller = params.controller;
		var action     = params.action;

		if (typeof controller !== 'undefined' && controller) {
			link += controller
		} else {
			link += Inflector.tableize(this.name);
		}
		delete(params.controller);
		link += '/';

		if (typeof action !== 'undefined' && action) {
			link += action;
		}
		delete(params.action);

		if (params) {
			Object.keys(params).forEach(function(key) {
				var param = params[key];

				if (key === 'id') {
					link += '/' + param;
				} else {
					link += '/' + key + ':' + param
				}
			});
		} else {
			link += '/';
		}
	} else if (typeof params === 'string') {
		link += params;
	}

	response.redirect(link);
}

exports.Controller = Controller;