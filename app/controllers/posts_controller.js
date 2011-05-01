var PostsController = new Controller('Post');

PostsController.view = function(response, id) {
	PostsController.Post.once('find', function(data) {
		PostsController.set(response, data);
	});

	PostsController.Post.find(id);
};
exports.view = PostsController.view;