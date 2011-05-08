function Mysql(model, dataSource, table) {
	this.model      = model;
	this.dataSource = dataSource;
	this.table      = table;

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

Mysql.prototype.read = function (params, callback) {
	var self  = this,
		query = 'SELECT ';

	if (typeof params.fields != 'undefined') {
		query += params.fields.join(', ') + ' ';
	} else {
		query += '* ';
	}
	query += 'FROM ' + this.table + ' ';

	if (typeof params.conditions != 'undefined') {
		query += this._contsructConditionsSqlStatement(params.conditions);
	} else {
		query += '';
	}

	console.log('Mysql.read() query:', query);
	this.client.query(query, function (error, results, fields) {
		if (error) { throw error; }

		callback(results);
	});
}

Mysql.prototype.create = function(fields, values) {}
Mysql.prototype.update = function (id) {}
Mysql.prototype.remove = function (id) {}

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
				statements.push(i + ' = "' + condition + '"');
			} else {
				statements.push(i + ' = ' + condition);
			}
		}
	}

	return 'WHERE ' + statements.join('AND ') + ' ';
}

exports.Mysql = Mysql;