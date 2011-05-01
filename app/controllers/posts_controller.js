var PostsController = new Controller('Post');

PostsController.view = function(request, response, id) {
	PostsController.Post.once('find', function(data) {
		PostsController.set(request, response, data);
	});

	PostsController.Post.find(id);
};
exports.view = PostsController.view;