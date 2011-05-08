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
		console.log('PostsController.Post.find() results:', results);
		PostsController.set(request, response, results);
	});
}