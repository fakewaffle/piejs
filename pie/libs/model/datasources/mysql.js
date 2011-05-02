function Mysql(params) {
	var dataSource = params.dataSource;

	var Client  = require('mysql').Client;
	this.client = new Client;

	this.database        = dataSource.database;
	this.tableName       = params.modelName.tableize();
	this.client.user     = dataSource.user;
	this.client.password = dataSource.password;

	this.client.connect();
	this.client.query('USE ' + this.database);

	events.EventEmitter.call(this);
};
util.inherits(Mysql, events.EventEmitter);

Mysql.prototype.create = function(model, fields, values) {};

Mysql.prototype.read = function (model, conditions) {
	var self = this;

	this.client.query('SELECT * FROM ' + this.tableName, function selectCb(error, results, fields) {
		if (error) { throw error; }

		console.log(results);
		self.emit('read', results);
	});
};

Mysql.prototype.update = function (model, id) {};
Mysql.prototype.remove = function (model, id) {};

exports.Mysql = Mysql;