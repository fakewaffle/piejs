function Model(params) {
	this.name       = params.model;
	var dataSource  = require('./datasources/' + params.dataSource)[params.dataSource.camelize()];
	this.dataSource = new dataSource(params.model, config.app.database[params.dataSource], params.model.tableize());

	// console.log('setting up model', '"' + this.name + '"', 'with params:', this, '\n');
	// events.EventEmitter.call(this);
}
// util.inherits(Model, events.EventEmitter);

Model.prototype.find = function(type, params, callback) {
	var self = this;

	if (type == 'first') {
		this.dataSource.once('read', function(results) {
			var tempResults    = results[0];
			results            = {};
			results[self.name] = tempResults;

			callback(results)
		});
		this.dataSource.read(params);
	}
}

Model.prototype.save = function(data) {}
Model.prototype.remove = function(conditions) {}

exports.Model = Model;