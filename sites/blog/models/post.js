exports.Post = {
	'name'       : 'Post',
	'dataSource' : 'mysql',
	'belongsTo'  : {
		'User' : null
	}
};

exports.beforeSave = function(results, callback) {
	callback(results);
}

exports.afterSave = function(created, results, callback) {
	callback();
}