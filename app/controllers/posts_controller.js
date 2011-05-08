var PostsController = new Controller('Post');

exports.view = function(request, response, id) {
	PostsController.Post.find('first', {
		'conditions' : {
			'id' : id
		}
	}, function(results) {
		PostsController.set(request, response, results);
	});
}