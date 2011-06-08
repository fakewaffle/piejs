exports.Post = {
	'name'       : 'Post',
	'dataSource' : 'mysql',
	'belongsTo'  : {
		'User' : null
	}
};

exports.beforeSave = function(data, save) {
	data.name = Inflector.titleize(data.name);
	save(data);
}