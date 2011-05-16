var PostsController = new Controller('Post');

exports.index = function(request, response, id) {
	PostsController.Post.find('all', null, function(results) {
		PostsController.set(request, response, results);
	});
}

exports.view = function(request, response, id) {
	PostsController.Post.find('first', {
		'conditions' : {
			'id' : id
		},
		'fields' : [
			'name',
			'content'
		]
	}, function(results) {
		PostsController.set(request, response, results);
	});
}

exports.add = function(request, response) {
	// var data = request.body;

	var faker = require(config.paths.pie.faker);
	var data = {
		'name' : faker.Lorem.sentence(),
		'content' : faker.Lorem.paragraphs()
	};

	PostsController.Post.save(data, function(info) {
		response.redirect('posts/index');
	});
}

exports.edit = function(request, response) {
	// var data = request.body;

	PostsController.Post.save(data, function(info) {
		response.redirect('posts/index');
	});
}