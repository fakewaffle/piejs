function Mysql(model, params) {
	this.model = model;
	this.table = params.table;

	var startQuote = '`';
	var endQuote   = '`';

	var Client  = require('mysql').Client;
	this.client = new Client({
		'host'     : params.host,
		'port'     : params.port,
		'database' : params.database,
		'table'    : params.table,
		'user'     : params.user,
		'password' : params.password
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