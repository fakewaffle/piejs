exports.Post = {
	'name'       : 'Post',
	'dataSource' : 'mysql',
	'belongsTo'  : {
		'User' : null
	}
};

exports.beforeSave = function(data, callback) {
	data.name = Inflector.titleize(data.name);
	callback(data);
}