var PostsController = exports.PostsController = new Controller({
	'name' : 'Post',
	'helpers' : [
		'Html',
		'Form',
		'ShowCode'
	]
});

// Not doing anything here... yet!
exports.beforeFilter = function(request, response, callback) {
	callback(request, response);
}

exports.index = function(request, response) {
	// Find all posts
	PostsController.Post.find('all', null, function(results) {
		// Send the results to render the view
		PostsController.set(request, response, results);
	});
}

exports.view = function(request, response) {
	var id = request.namedParams.id;

	// Find the first post that matches the passed id
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
		// Send the results to render the view
		PostsController.set(request, response, results);
	});
}

exports.add = function(request, response) {
	var data = request.data;

	if (typeof data === 'undefined') {
		PostsController.set(request, response);
	} else {
		PostsController.Post.save(data, function(info) {
			if (info !== false) {
				request.flash('info', 'Post has been added.');
			} else {
				request.flash('info', 'Failed to add the post.');
			}

			PostsController.redirect(response, { 'controller' : 'posts' });
		});
	}
}

exports.add_fake = function(request, response) {
	var faker = require(pie.paths.pie.faker);
	var data = {
		'Post' : {
			'user_id' : 1,
			'name'    : faker.Lorem.sentence(),
			'content' : faker.Lorem.paragraphs()
		}
	};

	PostsController.Post.save(data, function(info) {
		if (info !== false) {
			request.flash('info', 'A fake post has been added.');
		} else {
			request.flash('info', 'Failed to create the fake post.');
		}

		PostsController.redirect(response, { 'controller' : 'posts' });
	});
}

exports.edit = function(request, response) {
	var data = request.data;

	// Find the post data since nothing has been POSTed
	if (typeof data === 'undefined' && !data) {
		var id = request.namedParams.id;

		PostsController.Post.find('first', {
			'conditions' : {
				'id' : id
			}
		}, function(results) {
			// Send the results to render the view
			PostsController.set(request, response, results);
		});
	} else {
		PostsController.Post.save(data, function(info) {
			if (info !== false) {
				request.flash('info', 'Post has been edited.');
			} else {
				request.flash('info', 'Failed to edit the post.');
			}

			PostsController.redirect(response, { 'action' : 'view', 'id' : data.Post.id });
		});
	}
}

exports.remove = function(request, response) {
	var id = request.namedParams.id;

	PostsController.Post.remove({
		'id' : id
	}, function(results) {
		var	success;

		if (results) {
			success = 'Post deleted.';
		} else {
			success = 'Failed to delete post.';
		}

		request.flash('info', success);
		PostsController.redirect(response, { 'controller' : 'posts' });
	});
}