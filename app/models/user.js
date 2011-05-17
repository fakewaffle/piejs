var User = {
	'model'      : 'User',
	'dataSource' : 'mysql',
	'hasMany'    : {
		'Post' : null
	}
};
exports.User = User;