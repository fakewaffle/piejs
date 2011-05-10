function Controller(name) {
	this.name       = name;
	this[this.name] = require(config.paths.app.models + name.toLowerCase())[this.name];
}

Controller.prototype.set = function(request, response, results) {
	var	params     = request.params,
		controller = params.controller,
		action     = params.action;

	response.render(controller + '/' + action, {
		layout : config.paths.app.views.layouts + 'default.jade',
		locals : results
	});
}

exports.Controller = Controller;