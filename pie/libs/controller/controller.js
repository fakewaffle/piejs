function Controller(name) {
	this.name       = name;
	var model       = require(config.paths.app.models + this.name.toLowerCase())[this.name];
	this[this.name] = new Model(model);

	if (typeof model.belongsTo != 'undefined' && model.belongsTo) {
		for (var i in model.belongsTo) {
			var belongsToModel = require(config.paths.app.models + i.toLowerCase())[i];
			this[this.name][i] = new Model(belongsToModel);
		}
	}

	if (typeof model.hasMany != 'undefined' && model.hasMany) {
		for (var i in model.hasMany) {
			var belongsToModel = require(config.paths.app.models + i.toLowerCase())[i];
			this[this.name][i] = new Model(belongsToModel);
		}
	}
}

Controller.prototype.set = function(request, response, results) {
	var	params     = request.params,
		controller = params.controller,
		action     = params.action;

	results.flash = request.flash();

	var responseParams = {
		'layout' : config.paths.app.views.layouts + 'default.jade',
		'locals' : results
	};

	response.render(controller + '/' + action, responseParams);
}
exports.Controller = Controller;