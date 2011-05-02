function Model(params) {
	this.params = params;
	this.name   = this.params.model;

	var dataSource        = require('./datasources/' + this.params.dataSource.name)[this.params.dataSource.name.camelize()];
	this.params.modelName = this.name;
	this.dataSource       = new dataSource(this.params);

	console.log('setting up model', '"' + this.name + '"', 'with params:', this, '\n');
	events.EventEmitter.call(this);
};
util.inherits(Model, events.EventEmitter);

Model.prototype.find = function(conditions) {
	var self = this;

	this.dataSource.once('read', function(results) {
		self.emit('find', results);
	});
	this.dataSource.read(this.name, conditions);
};

Model.prototype.save = function(data) {};
Model.prototype.remove = function(conditions) {};

exports.Model = Model;