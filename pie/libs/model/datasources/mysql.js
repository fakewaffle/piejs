function Mysql(model, dataSource, table) {
	this.startQuote = '`';
	this.endQuote   = '`';

	this.model      = model;
	this.dataSource = dataSource;
	this.table      = this.startQuote + table + this.endQuote;

	var Client  = require('mysql').Client;
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
 * 2011-05-12 23.55.47 - Justin Morris
 */
Mysql.prototype.create = function(data, callback) {
	var query   = 'INSERT INTO ' + this.table + ' ',
		columns = [],
		values  = [];

	for (var i in data) {
		columns.push(this.startQuote + i + this.endQuote);
		values.push(this.client.escape(data[i]));
	}

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
 * 2011-05-12 23.52.19 - Justin Morris
 */
Mysql.prototype.read = function (type, params, callback) {
	var query = 'SELECT ';

	if (params) {
		if (typeof params.fields != 'undefined' && params.fields) {
			for (var i = params.fields.length - 1; i >= 0; i--) {
				params.fields[i] = this.startQuote + params.fields[i] + this.endQuote;
			}
			query += params.fields.join(', ') + ' ';
		} else {
			query += '* ';
		}
		query += 'FROM ' + this.table + ' ';

		if (typeof params.conditions != 'undefined' && params.conditions) {
			query += this._contsructConditionsSqlStatement(params.conditions);
		} else {
			query += '';
		}

		if (type == 'first') {
			query += 'LIMIT 1';
		} else if (typeof params.limit != 'undefined' && params.limit && typeof	params.limit == 'number' ) {
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
 * 2011-05-16 14.47.19 - Justin Morris
 */
Mysql.prototype.update = function (data, callback) {
	var query = 'UPDATE ' + this.table + ' SET ',
		set   = [];

	for (var i in data) {
		if (i != 'id') {
			set.push(this.startQuote + i + this.endQuote + ' = ' + 	this.client.escape(data[i]));
		}
	}

	query += set.join(', ') + ' ';
	query += 'WHERE ' + this.startQuote + 'id' + this.endQuote + ' = ' + this.client.escape(data.id);

	this._query(query, callback);
}

Mysql.prototype.remove = function (id) {}

/**
 * Queries the database.
 *
 * @param string query Query string to run
 * @param function callback Callback to be executed after query is finished
 *
 * 2011-05-16 21.56.06 - Justin Morris
 */
Mysql.prototype._query = function(query, callback) {
	console.log('Mysql query:', query, '\n');

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
 * 2011-05-03 16.38.03 - Justin Morris
 */
Mysql.prototype._contsructConditionsSqlStatement = function(conditions) {
	var statements = [];

	for (var i in conditions) {
		var condition = conditions[i];

		if (i == 'SQL') {
			statements.push(condition);
		} else {
			if (typeof condition == 'string') {
				statements.push(this.startQuote + i + this.endQuote + ' = ' + this.client.escape(condition));
			} else {
				statements.push(this.startQuote + i + this.endQuote + ' = ' + this.client.escape(condition));
			}
		}
	}

	return 'WHERE ' + statements.join('AND ') + ' ';
}

exports.Mysql = Mysql;