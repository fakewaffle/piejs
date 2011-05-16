function Controller(name) {
	this.name       = name;
	this[this.name] = require(config.paths.app.models + this.name.toLowerCase())[this.name];
}

Controller.prototype.set = function(request, response, results) {
	var	params     = request.params,
		controller = params.controller,
		action     = params.action;

	var responseParams = {
		'layout' : config.paths.app.views.layouts + 'default.jade',
		'locals' : results,
	};

	response.render(controller + '/' + action, responseParams);
}
exports.Controller = Controller;