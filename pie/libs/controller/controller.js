function Controller(name) {
	this.name       = name;
	this[this.name] = require(config.paths.app.models + '/' + name.toLowerCase())[this.name];

	// console.log('setting up controller', '"' + this.name + '"\n');
	events.EventEmitter.call(this);
}
util.inherits(Controller, events.EventEmitter);

Controller.prototype.set = function(request, response, results) {
	var	params     = request.params,
		controller = params.controller,
		action     = params.action;

	response.render(controller + '/' + action, {
		layout : config.paths.app.views.layouts + '/default.jade',
		data   : results
	});
}

exports.Controller = Controller;