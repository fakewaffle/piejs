function Stool() {
	this.dataLocation = __dirname + '/../../../../stool/';

	events.EventEmitter.call(this);
};
util.inherits(Stool, events.EventEmitter);

Stool.prototype.create = function(model, fields, values) {};

Stool.prototype.read = function (model, id) {
	var self = this;
	
	fs.readFile(this.dataLocation + model.tableize() + '/' + id + '.json', 'utf8', function(error, data) { self.emit('read', data); });
};

Stool.prototype.update = function (model, id) {};
Stool.prototype.remove = function (model, id) {};

exports.Stool = Stool;