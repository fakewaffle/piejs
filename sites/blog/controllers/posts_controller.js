var PostsController = new Controller({
	'name' : 'Post',
	'site' : 'blog',
	'helpers' : [
		'Html',
		'Form'
	]
});

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
			'id',
			'user_id',
			'name',
			'content'
		],
		'contain' : {
			'User' : null
		}
	}, function(results) {
		PostsController.set(request, response, results);
	});
}

exports.add = function(request, response) {
	var data = request.body;

	if (typeof data === 'undefined') {
		PostsController.set(request, response);
	} else {
		PostsController.Post.save(data, function(info) {
			request.flash('info', 'Post has been added.');
			response.redirect('/blog/posts');
		});
	}
}

exports.edit = function(request, response, id) {
	var data = request.body;

	if (typeof data === 'undefined') {
		PostsController.Post.find('first', {
			'conditions' : {
				'id' : id
			}
		}, function(results) {
			PostsController.set(request, response, results);
		});
	} else {
		PostsController.Post.save(data, function(info) {
			request.flash('info', 'Post has been edited.');
			response.redirect('/blog/posts/view/' + data.id);
		});
	}
}