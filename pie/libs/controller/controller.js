/**
 * Creates a controller in which a users controller will inherit from.
 *
 * Controller will load the model (and related models), and provide the model's
 * standard methods to find and save data in a data source agnostic way.
 *
 * @param Object params Parameters for the controller (name, site, helpers)
 *
 * 2011-05-17 23.16.13 - Justin Morris
 */
function Controller(params) {
	var self              = this;
	this.name             = params.name;
	this.site             = params.site;
	this.requestedHelpers = params.helpers;
	this.helpers          = {};
	this[this.name]       = pie.sites[this.site].models[this.name];

	if (typeof this[this.name].belongsTo !== 'undefined' && this[this.name].belongsTo) {
		Object.keys(self[self.name].belongsTo).forEach(function(key) {
			self[self.name][key] = pie.sites[self.site].models[key];
		});
	}

	if (typeof this[this.name].hasMany !== 'undefined' && this[this.name].hasMany) {
		Object.keys(self[self.name].hasMany).forEach(function(key) {
			self[self.name][key] = pie.sites[self.site].models[key];
		});
	}

	if (typeof this.requestedHelpers !== 'undefined' && this.requestedHelpers) {
		Object.keys(self.requestedHelpers).forEach(function(key) {
			var requestedHelper = self.requestedHelpers[key];
			var helperFile      = requestedHelper.underscore() + '.js';
			var Helper          = null;
			var PieHelper       = null;
			var SiteHelper      = null;

			// Try to load the Helper form the Pie core - piejs/pie/libs/view/helpers/
			try { PieHelper  = require(pie.paths.pie.view.helpers  + helperFile); } catch(e) {}
			if (PieHelper) { Helper  = PieHelper[requestedHelper]; }

			// Try to load the Helper from the site - piejs/sites/[name]/views/helpers/
			try { SiteHelper = require(pie.paths.sites[self.site].views.helpers  + helperFile); } catch(e) {}
			if (SiteHelper) { Helper = SiteHelper[requestedHelper]; }

			self.helpers[requestedHelper] = new Helper(self.name, self.site);
		});
	}
3}

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
		'layout'  : pie.paths.sites[this.site].views.layouts + layout + '.' + pie.config.sites[this.site].core.viewEngine,
		'locals'  : results,
		'pie' : {
			'Helper' : this.helpers
		}
	};

	server.set('views', pie.paths.sites[this.site].views.path);
	server.set('view engine', pie.config.sites[this.site].core.viewEngine);

	response.render(controller + '/' + action, responseParams);
}
exports.Controller = Controller;