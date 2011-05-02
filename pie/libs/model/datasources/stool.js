function Stool(model, params) {
	this.model = model;
	this.dataLocation = __dirname + '/../../../../stool/';

	events.EventEmitter.call(this);
};
util.inherits(Stool, events.EventEmitter);

Stool.prototype.create = function(fields, values) {};

Stool.prototype.read = function (params) {
	var self = this;
	
	console.log(params);

	fs.readFile(this.dataLocation + this.model.tableize() + '/' + params.conditions.id + '.json', 'utf8', function(error, data) {
		self.emit('read', JSON.parse(data));
	});
};

Stool.prototype.update = function (id) {};
Stool.prototype.remove = function (id) {};

exports.Stool = Stool;