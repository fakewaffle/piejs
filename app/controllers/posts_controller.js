var PostsController = new Controller('Post');

exports.view = function(request, response, id) {
	PostsController.Post.find('first', {
		'conditions' : {
			'user_id' : id
		},
		'fields' : [
			'name',
			'content'
		]
	}, function(results) {
		PostsController.set(request, response, results);
	});
}