function Model(params) {
	this.name       = params.model;
	var dataSource  = require(config.paths.pie.datasource.path + params.dataSource)[params.dataSource.camelize()];
	this.dataSource = new dataSource(params.model, config.app.database[params.dataSource], params.model.tableize());

	if (typeof params.validation != 'undefined' && params.validation) {
		this.validation = params.validation;
	}
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

Model.prototype.save = function(data, callback) {
	if (typeof data != 'undefined' && data) {
		if (typeof data.id !='undefined' && data.id) {
			this.dataSource.update(data, function(results) {
				callback(results);
			});
		} else {
			this.dataSource.create(data, function(results) {
				callback(results);
			});
		}
	}
}

Model.prototype.remove = function(conditions) {}

exports.Model = Model;