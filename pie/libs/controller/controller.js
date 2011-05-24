/**
 * Creates a controller in which a users controller will inherit from.
 *
 * Controller will load the model (and related models), and provide the model's
 * standard methods to find and save data in a data source agnostic way.
 *
 * @param string name Name of the model (ie: Post, Tag, User)
 * @param string site Name of the site (ie: blog, evil-plan)
 *
 * 2011-05-17 23.16.13 - Justin Morris
 */
function Controller(name, site) {
	this.name       = name;
	this.site       = site
	this[this.name] = pie.sites[this.site].models[this.name];

	if (typeof this[this.name].belongsTo !== 'undefined' && this[this.name].belongsTo) {
		for (var i in this[this.name].belongsTo) {
			this[this.name][i] = pie.sites[this.site].models[i];
		}
	}

	if (typeof this[this.name].hasMany !== 'undefined' && this[this.name].hasMany) {
		for (var i in this[this.name].hasMany) {
			this[this.name][i] = pie.sites[this.site].models[i];
		}
	}

	console.log('Setup controller "' + name + '" for site "' + site + '"');
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
		'layout' : pie.paths.sites[this.site].views.layouts + layout + '.' + pie.config.sites[this.site].core.viewEngine,
		'locals' : results
	};

	server.set('views', pie.paths.sites[this.site].views.path);
	server.set('view engine', pie.config.sites[this.site].core.viewEngine);

	response.render(controller + '/' + action, responseParams);
}
exports.Controller = Controller;