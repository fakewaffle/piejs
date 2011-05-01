function Model(params) {
	this.name       = params.model;
	var dataSource  = require('./datasources/' + params.dataSource)[params.dataSource.camelize()];
	this.dataSource = new dataSource;

	console.log('setting up model', '"' + this.name + '"', 'with params:', this, '\n');

	events.EventEmitter.call(this);
};
util.inherits(Model, events.EventEmitter);

Model.prototype.find = function(conditions, callback) {
	var self = this;

	this.dataSource.once('read', function(data) {
		self.emit('find', data);
	});
	this.dataSource.read(this.name, conditions);
};

Model.prototype.save = function(data) {};
Model.prototype.remove = function(conditions) {};

exports.Model = Model;