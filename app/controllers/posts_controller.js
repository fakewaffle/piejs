var PostsController = new Controller('Post');

PostsController.view = function(request, response, id) {
	PostsController.Post.find('first', {
		'conditions' : {
			'id' : id
		}
	}, function(results) {
		PostsController.set(request, response, results);
	});
}
exports.view = PostsController.view;