function Mysql(model, dataSource, table) {
	this.startQuote = '`';
	this.endQuote   = '`';

	this.model      = model;
	this.dataSource = dataSource;
	this.table      = this.startQuote + table + this.endQuote;

	var Client  = require(pie.paths.pie.modules.mysql).Client;
	this.client = new Client({
		'host'     : dataSource.host,
		'port'     : dataSource.port,
		'database' : dataSource.database,
		'user'     : dataSource.user,
		'password' : dataSource.password,
		'table'    : this.table
	});
	this.client.connect();
}

/**
 * The "C" in CRUD
 *
 * @param object data { field:value } of data to be inserted into the database
 * @param function callback Callback to be executed after create is finished
 *
 * @author Justin Morris
 * @created 2011-05-12 23.55.47
 */
Mysql.prototype.create = function(data, callback) {
	var self    = this;
	var query   = 'INSERT INTO ' + this.table + ' ';
	var columns = [];
	var values  = [];

	Object.keys(data).forEach(function(key) {
		columns.push(self.startQuote + key + self.endQuote);
		values.push(self.client.escape(data[key]));
	});

	query += '(' + columns.join(', ') + ') ';
	query += 'VALUES (' + values.join(', ') + ')';

	this._query(query, callback);
}

/**
 * The "R" in CRUD.
 *
 * @param string type Type of find, such as 'first', 'all', 'count', 'list'
 * @param object params Object containing conditions, fields, limit, etc
 * @param function callback Callback to be executed after read is finished
 *
 * @author Justin Morris
 * @created 2011-05-12 23.52.19
 */
Mysql.prototype.read = function (type, params, callback) {
	var query = 'SELECT ';

	if (params) {
		if (typeof params.fields !== 'undefined' && params.fields) {
			for (var i = params.fields.length - 1; i >= 0; i--) {
				params.fields[i] = this.startQuote + params.fields[i] + this.endQuote;
			}
			query += params.fields.join(', ') + ' ';
		} else {
			query += '* ';
		}
		query += 'FROM ' + this.table + ' ';

		if (typeof params.conditions !== 'undefined' && params.conditions) {
			query += this._contsructConditionsSqlStatement(params.conditions);
		} else {
			query += '';
		}

		if (type === 'first') {
			query += 'LIMIT 1';
		} else if (typeof params.limit !== 'undefined' && params.limit && typeof	params.limit === 'number' ) {
			query += 'LIMIT ' + params.limit;
		}
	} else {
		query += '* FROM ' + this.table;
	}

	this._query(query, callback);
}

/**
 * The "U" in CRUD
 *
 * @param object data { field:value } of data to be updated in the database
 * @param function callback Callback to be executed after update is finished
 *
 * @author Justin Morris
 * @created 2011-05-16 14.47.19
 */
Mysql.prototype.update = function (data, callback) {
	var self  = this;
	var query = 'UPDATE ' + this.table + ' SET ';
	var set   = [];

	Object.keys(data).forEach(function(key) {
		if (key !== 'id') {
			set.push(self.startQuote + key	 + self.endQuote + ' = ' + 	self.client.escape(data[key]));
		}
	});

	query += set.join(', ') + ' ';
	query += 'WHERE ' + this.startQuote + 'id' + this.endQuote + ' = ' + this.client.escape(data.id);

	this._query(query, callback);
}

/**
 * Removes a record from the database.
 *
 * @param object conditions Conditions that must be met for a record to be deleted
 * @param function callback Callback to be executed after remove is finished
 *
 * @author Justin Morris
 * @created 2011-05-26 22.27.32
 */
Mysql.prototype.remove = function (conditions, callback) {
	var self  = this;
	var query = 'DELETE FROM ' + this.table;

	query += this._contsructConditionsSqlStatement(conditions);

	this.client.query(query, function (error, results) {
		if (error) {
			throw error;
		}

		if (results.affectedRows >= 1) {
			callback(true);
		} else {
			callback(false);
		}
	});
}

/**
 * Queries the database.
 *
 * @param string query Query string to run
 * @param function callback Callback to be executed after query is finished
 *
 * @author Justin Morris
 * @created 2011-05-16 21.56.06
 */
Mysql.prototype._query = function(query, callback) {
	this.client.query(query, function (error, results) {
		if (error) {
			throw error;
		}

		callback(results);
	});
}

/**
 * Construct a SQL statement for conditions.
 *
 * @param array conditions Conditions to construct SQL statement with
 * @return string
 *
 * @author Justin Morris
 * @created 2011-05-03 16.38.03
 */
Mysql.prototype._contsructConditionsSqlStatement = function(conditions) {
	var self       = this;
	var statements = [];

	Object.keys(conditions).forEach(function(key) {
		var condition = conditions[key];

		if (key === 'SQL') {
			statements.push(condition);
		} else {
			statements.push(self.startQuote + key + self.endQuote + ' = ' + self.client.escape(condition));
		}
	});

	return 'WHERE ' + statements.join(' AND ') + ' ';
}

exports.Mysql = Mysql;