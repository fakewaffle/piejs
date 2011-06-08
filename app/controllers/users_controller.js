var UsersController = exports.UsersController = new Controller({
	'name' : 'User',
	'helpers' : [
		'Html'
	]
});

exports.index = function(request, response, id) {
	UsersController.User.find('all', null, function(results) {
		UsersController.set(request, response, results);
	});
}

exports.view = function(request, response, id) {
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
	// var data = request.body;

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

exports.edit = function(request, response, id) {
	// var data = request.body;

	var faker = require(config.paths.pie.faker);
	var data = {
		'id'    : id,
		'name'  : faker.Name.firstName() + ' ' + faker.Name.lastName(),
		'email' : faker.Internet.email()
	};

	UsersController.User.save(data, function(info) {
		request.flash('info', 'User has been edited.');
		response.redirect('users');
	});
}