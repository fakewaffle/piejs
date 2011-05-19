/**
 * Provides standard methods to find and save data in a data source agnostic way.
 *
 * @param Object model Model object created in app/models
 *
 * 2011-05-18 15.28.38 - Justin Morris
 */
function Model(model) {
	this.name       = model.name;
	var dataSource  = require(config.paths.pie.datasource.path + model.dataSource)[model.dataSource.camelize()];
	this.dataSource = new dataSource(this.name, config.app.database[model.dataSource], this.name.tableize());

	if (typeof model.validation != 'undefined' && model.validation) {
		this.validation = model.validation;
	}

	if (typeof model.belongsTo != 'undefined' && model.belongsTo) {
		this.belongsTo = model.belongsTo;
	}

	if (typeof model.hasMany != 'undefined' && model.hasMany) {
		this.hasMany = model.hasMany;
	}
}

/**
 * Abstracted find for read methods on a datasource.
 *
 * @param string type Type of find ('first', 'all', 'count', 'list')
 * @param Object params Parameters (conditions, fields, limit, contain)
 * @param function callback Callback to be executed after find is finished
 *
 * 2011-05-18 20.13.16 - Justin Morris
 */
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

/**
 * Abstracted save for create and update methods on a datasource.
 *
 * @param Object data Data to be saved { key:value }
 * @param function callback Callback to be executed after save is finished
 *
 * 2011-05-18 20.30.19 - Justin Morris
 */
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

/**
 * Abstracted delete/remove for delete/remove methods on a datasource.
 *
 * TODO: Implement.
 *
 * 2011-05-18 20.31.35 - Justin Morris
 */
Model.prototype.remove = function(conditions) {}

/**
 * Handle cantain for Model.find(...).
 *
 * TODO: Handle recursion.
 * TODO: Handle params in a model contain, such as fields.
 * TODO: Check whether it really works with more than one other model.
 *
 * @param Object results Results from the Model.find(...)
 * @param Object contains An object that
 * @param function callback Callback to be executed after contain is finished
 *
 * 2011-05-18 20.32.46 - Justin Morris
 */
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