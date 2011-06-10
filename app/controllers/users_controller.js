var UsersController = exports.UsersController = new Controller({
	'name' : 'User',
	'helpers' : [
		'Html',
		'ShowCode'
	]
});

exports.index = function(request, response) {
	UsersController.User.find('all', null, function(results) {
		UsersController.set(request, response, results);
	});
}

exports.view = function(request, response) {
	var id = request.namedParams.id;

	UsersController.User.find('first', {
		'conditions' : {
			'id' : id
		},
		'fields' : [
			'id',
			'name',
			'email'
		],
		'contain' : {
			'Post' : null
		}
	}, function(results) {
		UsersController.set(request, response, results);
	});
}

exports.add = function(request, response) {
	var faker = require(config.paths.pie.faker);
	var data = {
		'name'  : faker.Name.firstName() + ' ' + faker.Name.lastName(),
		'email' : faker.Internet.email()
	};

	UsersController.User.save(data, function(info) {
		request.flash('info', 'User has been added.');
		response.redirect('users');
	});
}