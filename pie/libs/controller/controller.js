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
	var model       = require(config.paths.sites[this.site].models + this.name.toLowerCase())[this.name];
	this[this.name] = new Model(model, this.site);

	if (typeof model.belongsTo != 'undefined' && model.belongsTo) {
		for (var i in model.belongsTo) {
			var belongsToModel = require(config.paths.sites[this.site].models + i.toLowerCase())[i];
			this[this.name][i] = new Model(belongsToModel, this.site);
		}
	}

	if (typeof model.hasMany != 'undefined' && model.hasMany) {
		for (var i in model.hasMany) {
			var belongsToModel = require(config.paths.sites[this.site].models + i.toLowerCase())[i];
			this[this.name][i] = new Model(belongsToModel, this.site);
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
 * 2011-05-17 23.20.50 - Justin Morris
 */
Controller.prototype.set = function(request, response, results, layout) {
	var	params     = request.params,
		controller = params.controller,
		action     = params.action,
		results    = results,
		layout     = layout;

	if (typeof results == 'undefined') {
		results = {};
	}
	results.flash = request.flash();

	if (typeof layout == 'undefined') {
		layout = 'default';
	}

	var responseParams = {
		'layout' : config.paths.sites[this.site].views.layouts + layout + '.' + config.sites[this.site].core.viewEngine,
		'locals' : results
	};

	server.set('views', config.paths.sites[this.site].views.path);
	server.set('view engine', config.sites[this.site].core.viewEngine);

	response.render(controller + '/' + action, responseParams);
}
exports.Controller = Controller;