function Controller(name) {
	this.name       = name;
	this[this.name] = require('../../../app/models/' + name.toLowerCase())[this.name];

	console.log('setting up controller', '"' + this.name + '"\n');

	events.EventEmitter.call(this);
};
util.inherits(Controller, events.EventEmitter);

Controller.prototype.set = function(request, response, data) {
	var	params     = request.params,
		controller = params.controller,
		action     = params.action;
	
	response.render(controller + '/' + action, {
		layout : __dirname + '/../../../app/views/layouts/default.jade',
		data   : data
	});
};

exports.Controller = Controller;