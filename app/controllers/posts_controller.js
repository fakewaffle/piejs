var PostsController = new Controller('Post');

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

exports.index = function(request, response, id) {	
	PostsController.Post.find('all', null, function(results) {
		PostsController.set(request, response, results);
	});
}