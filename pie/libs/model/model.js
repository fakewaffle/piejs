function Model(params) {
	this.name       = params.model;
	var dataSource  = require('./datasources/' + params.dataSource)[params.dataSource.camelize()];
	this.dataSource = new dataSource(params.model, config.app.database[params.dataSource], params.model.tableize());
}

Model.prototype.find = function(type, params, callback) {
	var self = this;

	this.dataSource.read(type, params, function(results) {
		var tempResults;

		if (results.length == 1) {
			tempResults = results[0];
		} else {
			tempResults = results;
		}

		results            = {};
		results[self.name] = tempResults;

		callback(results);
	});
}

Model.prototype.save = function(data) {}
Model.prototype.remove = function(conditions) {}

exports.Model = Model;