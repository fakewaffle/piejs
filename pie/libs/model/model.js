function Model(params) {
	this.name       = params.model;
	var dataSource  = require(config.paths.pie.datasource.path + params.dataSource)[params.dataSource.camelize()];
	this.dataSource = new dataSource(params.model, config.app.database[params.dataSource], params.model.tableize());

	if (typeof params.validation != 'undefined' && params.validation) {
		this.validation = params.validation;
	}

	if (typeof params.belongsTo != 'undefined' && params.belongsTo) {
		this.belongsTo = params.belongsTo;
	}

	if (typeof params.hasMany != 'undefined' && params.hasMany) {
		this.hasMany = params.hasMany;
	}
}

Model.prototype.find = function(type, params, callback) {
	var self     = this,
		params   = params,
		callback = callback;

	this.dataSource.read(type, params, function(results) {
		var tempResults;

		if (results.length == 1) {
			tempResults = results[0];
		} else {
			tempResults = results;
		}

		results            = {};
		results[self.name] = tempResults;

		if (typeof params != 'undefined' && params && typeof params.contain != 'undefined' && params.contain) {
			self._contain(results, params.contain, callback);
		} else {
			callback(results);
		}
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

Model.prototype._contain = function(results, contains, callback) {
	var self = this;

	for (var i in contains) {
		var contain = contains[i];
		var params  = {
			'conditions' : {}
		};

		if (typeof this.belongsTo != 'undefined' && this.belongsTo && typeof this.belongsTo[i] != 'undefined') {
			params.conditions.id = results[self.name][i.foreign_key()];
		}

		if (typeof this.hasMany != 'undefined' && this.hasMany && typeof this.hasMany[i] != 'undefined') {
			params.conditions[self.name.foreign_key()] = results[self.name].id;
		}

		if (!contain) {
			self[i].find('all', params, function(containResults) {
				results[self.name][i] = containResults[i];
				callback(results);
			});
		}
	}
}

exports.Model = Model;