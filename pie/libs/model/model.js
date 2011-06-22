/**
 * Provides standard methods to find and save data in a data source agnostic way.
 *
 * @param object model Model object created in app/models
 *
 * @author Justin Morris
 * @created 2011-05-18 15.28.38
 */
function Model(model) {
	this.name = model.name;

	var dataSource  = pie.pie.dataSources[Inflector.camelize(model.dataSource)];
	this.dataSource = new dataSource(this.name, pie.config.app.database[model.dataSource], Inflector.tableize(this.name));

	if (typeof model.validation !== 'undefined' && model.validation) {
		this.validation = model.validation;
	}

	if (typeof model.belongsTo !== 'undefined' && model.belongsTo) {
		this.belongsTo = model.belongsTo;
	}

	if (typeof model.hasMany !== 'undefined' && model.hasMany) {
		this.hasMany = model.hasMany;
	}
}

/**
 * Abstracted find for read methods on a datasource.
 *
 * @param string type Type of find ('first', 'all', 'count', 'list')
 * @param object params Parameters (conditions, fields, limit, contain)
 * @param function callback Callback to be executed after find is finished
 *
 * @author Justin Morris
 * @created 2011-05-18 20.13.16
 */
Model.prototype.find = function(type, params, callback) {
	var self       = this;
	var beforeFind = pie.app.models[this.name].beforeFind;
	var afterFind  = pie.app.models[this.name].afterFind;

	var find = function() {
		self.dataSource.read(type, params, function(results) {
			var tempResults;

			if (results.length === 1 && type !== 'all') {
				tempResults = results[0];
			} else {
				tempResults = results;
			}

			results            = {};
			results[self.name] = tempResults;

			if (typeof params !== 'undefined' && params && typeof params.contain !== 'undefined' && params.contain) {
				self._contain(results, params.contain, callback);
			} else {
				if (afterFind) {
					afterFind(results, callback);
				} else {
					callback(results);
				}
			}
		});
	};

	if (beforeFind) {
		beforeFind(params, find);
	} else {
		find();
	}

}

/**
 * Abstracted save for create and update methods on a datasource.
 *
 * @param object data Data to be saved { key:value }
 * @param function callback Callback to be executed after save is finished
 *
 * @author Justin Morris
 * @created 2011-05-18 20.30.19
 */
Model.prototype.save = function(data, callback) {
	var self       = this;
	var beforeSave = pie.app.models[this.name].beforeSave;
	var afterSave  = pie.app.models[this.name].afterSave;
	var modelData  = data[this.name];

	if (typeof modelData !== 'undefined' && modelData) {

		var save = function() {
			if (typeof modelData.id !=='undefined' && modelData.id) {
				self.dataSource.update(modelData, function(results) {
					if (afterSave) {
						afterSave(false, results, callback);
					} else {
						callback(results);
					}
				});
			} else {
				self.dataSource.create(modelData, function(results) {
					if (afterSave) {
						afterSave(true, results, callback);
					} else {
						callback(results);
					}
				});
			}
		};

		if (beforeSave) {
			beforeSave(modelData, function(modelData) {
				if (modelData !== false) {
					save();
				} else {
					callback(false);
				}
			});
		} else {
			save();
		}
	}
}

/**
 * Abstracted delete/remove for delete/remove methods on a datasource.
 *
 * @param object conditions Conditions that must be met for a record to be deleted
 * @param function callback Callback to be executed after remove is finished
 *
 * @author Justin Morris
 * @created 2011-05-18 20.31.35
 */
Model.prototype.remove = function(conditions, callback) {
	var self         = this;
	var beforeDelete = pie.app.models[this.name].beforeDelete;
	var afterDelete  = pie.app.models[this.name].afterDelete;

	var remove = function() {
		self.dataSource.remove(conditions, function(results) {
			if (afterDelete) {
				afterDelete(conditions, callback);
			} else {
				callback(results);
			}
		});
	}

	if (beforeDelete) {
		beforeDelete(conditions, remove);
	} else {
		remove();
	}
}

/**
 * Handle cantain for Model.find(...).
 *
 * TODO: Handle recursion.
 * TODO: Handle params in a model contain, such as fields.
 *
 * @param object results Results from the Model.find(...)
 * @param object contains An object that
 * @param function callback Callback to be executed after contain is finished
 *
 * @author Justin Morris
 * @created 2011-05-18 20.32.46
 */
Model.prototype._contain = function(results, contains, callback) {
	var self = this;

	Object.keys(contains).forEach(function(key) {
		var contain = contains[key];
		var params  = { 'conditions' : {} };

		if (typeof self.belongsTo !== 'undefined' && self.belongsTo && typeof self.belongsTo[key] !== 'undefined') {
			var type         = 'first';
			var i            = 1;
			var resultsCount = results[self.name].length;

			if (resultsCount > 1) {
				results[self.name].forEach(function(result) {
					params.conditions.id = result[Inflector.foreignKey(key)];

					self[key].find(type, params, function(containResults) {
						if (typeof result[key] === 'undefined') {
							result[key] = {};
						}
						result[key] = containResults[key];

						if (i === resultsCount) {
							callback(results)
						}

						i++;
					});
				});
			} else {
				params.conditions.id = results[self.name][Inflector.foreignKey(key)];

				self[key].find(type, params, function(containResults) {
					results[self.name][key] = containResults[key];
					callback(results);
				});
			}
		}

		if (typeof self.hasMany !== 'undefined' && self.hasMany && typeof self.hasMany[key] !== 'undefined') {
			var type = 'all';

			params.conditions[Inflector.foreignKey(self.name)] = results[self.name].id;

			self[key].find(type, params, function(containResults) {
				results[self.name][key] = containResults[key];
				callback(results);
			});
		}
	});
}

exports.Model = Model;