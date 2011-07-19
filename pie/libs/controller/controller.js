/**
 * Creates a controller in which a users controller will inherit from.
 *
 * Controller will use its model (and related models), and provide the model's
 * standard methods to find and save data in a data source agnostic way.
 *
 * @param object params Parameters for the controller (name, helpers)
 *
 * @author Justin Morris
 * @created 2011-05-17 23.16.13
 */
function Controller(params) {
	var self              = this;
	this.name             = params.name;
	this[this.name]       = pie.app.models[this.name];
	this.webroot          = pie.config.app.core.webroot;
	this.requestedHelpers = params.helpers;

	if (typeof this[this.name] !== 'undefined') {
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
	}
}

/**
 * Sets the variables to the view, and renders the view for the requester.
 *
 * @param Object request Request object from express
 * @param Object response Response object from express
 * @param Object results Data to send to the view
 *
 * @author Justin Morris
 * @created 2011-05-17 23.20.50
 */
Controller.prototype.set = function(request, response, results, layout) {
	var self       = this;
	var helpers    = {};
	var params     = request.params;
	var controller = request.controller;
	var action     = request.action;

	if (typeof results === 'undefined') {
		results = {};
	}
	results.flash = request.flash();

	if (typeof layout === 'undefined') {
		layout = 'default';
	}

	if (typeof this.requestedHelpers !== 'undefined' && this.requestedHelpers) {
		Object.keys(self.requestedHelpers).forEach(function(key) {
			var requestedHelper = self.requestedHelpers[key];
			var helperFile      = Inflector.underscore(requestedHelper) + '.js';
			var Helper          = null;
			var PieHelper       = null;
			var AppHelper       = null;

			if (typeof pie.pie.helpers[requestedHelper] !== 'undefined') {
				Helper = pie.pie.helpers[requestedHelper];
			}

			if (typeof pie.app.helpers[requestedHelper] !== 'undefined') {
				Helper = pie.app.helpers[requestedHelper];
			}

			helpers[requestedHelper] = new Helper(self.name, {
				'results' : results,
				'request' : request
			});
		});
	}

	helpers.Sanitize  = Sanitize;
	helpers.Inflector = Inflector;

	var responseParams = {
		'layout'  : pie.paths.app.views.layouts + layout + '.' + pie.config.app.core.viewEngine,
		'locals'  : results,
		'pie' : {
			'Helper' : helpers
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
 * @author Justin Morris
 * @created 2011-05-30 09.13.41
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