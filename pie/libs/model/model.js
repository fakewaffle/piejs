function Model(params) {
	this.name = params.model;

	if (typeof config.app.database != 'undefined') {
		for (var i in config.app.database) {
			params.dataSource[i] = config.app.database[i];
		}
	}
	if (!params.dataSource.table) { params.dataSource.table = params.model.tableize(); }

	var dataSource  = require('./datasources/' + params.dataSource.name)[params.dataSource.name.camelize()];
	this.dataSource = new dataSource(params.model, params.dataSource);

	console.log('setting up model', '"' + this.name + '"', 'with params:', this, '\n');
	events.EventEmitter.call(this);
};
util.inherits(Model, events.EventEmitter);

Model.prototype.find = function(type, params) {
	var self = this;

	if (type == 'first') {
		this.dataSource.once('read', function(results) {
			var tempResults    = results;
			results            = {};
			results[self.name] = tempResults;

			self.emit('find', results);
		});
		this.dataSource.read(params);
	}
};

Model.prototype.save = function(data) {};
Model.prototype.remove = function(conditions) {};

exports.Model = Model;