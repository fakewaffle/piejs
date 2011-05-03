function Mysql(model, dataSource, table) {
	this.model      = model;
	this.dataSource = dataSource;
	this.table      = table;

	console.log('this.dataSource:', this.dataSource);

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

	events.EventEmitter.call(this);
};
util.inherits(Mysql, events.EventEmitter);

Mysql.prototype.read = function (params) {
	var self  = this,
		query = 'SELECT ';

	if (typeof params.fields != 'undefined') {
		query += params.fields.join(', ') + ' ';
	} else {
		query += '* ';
	}
	query += 'FROM ' + this.table + ' ';

	if (typeof params.conditions != 'undefined') {
		var conditions = [];

		for (var i in params.conditions) {
			var condition = params.conditions[i];

			if (i == 'SQL') {
				conditions.push(condition);
			} else {
				if (typeof condition == 'string') {
					conditions.push(i + ' = "' + condition + '"');
				} else {
					conditions.push(i + ' = ' + condition);
				}
			}
		}
		query += 'WHERE ' + conditions.join('AND ') + ' ';
	} else {
		query += '';
	}

	console.log('Mysql.read query:', query);
	this.client.query(query, function (error, results, fields) {
		if (error) { throw error; }

		self.emit('read', results);
	});
};

Mysql.prototype.create = function(fields, values) {};
Mysql.prototype.update = function (id) {};
Mysql.prototype.remove = function (id) {};

exports.Mysql = Mysql;