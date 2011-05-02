var PostsController = new Controller('Post');

PostsController.view = function(request, response, id) {
	PostsController.Post.once('find', function(results) {
		PostsController.set(request, response, results);
	});

	PostsController.Post.find(id);
};
exports.view = PostsController.view;