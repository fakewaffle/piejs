var PostsController = new Controller({
	'name' : 'Post',
	'helpers' : [
		'Html',
		'Form'
	]
});

exports.index = function(request, response, id) {
	// Find all posts
	PostsController.Post.find('all', null, function(results) {
		// Send this function's code to the view for display in "Code for this controller action:"
		results.controllerActionCode = exports.index.toString();

		// Send the results to render the view
		PostsController.set(request, response, results);
	});
}

exports.view = function(request, response, id) {
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
		// Send this function's code to the view for display in "Code for this controller action:"
		results.controllerActionCode = exports.view.toString();

		// Send the results to render the view
		PostsController.set(request, response, results);
	});
}

exports.add = function(request, response) {
	var data = request.data;

	if (typeof data === 'undefined') {
		// Send this function's code to the view for display in "Code for this controller action:"
		var results = {
			'controllerActionCode' : exports.add.toString()
		};

		PostsController.set(request, response, results);
	} else {
		PostsController.Post.save(data, function(info) {
			request.flash('info', 'Post has been added.');
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
		request.flash('info', 'A fake post has been added.');
		PostsController.redirect(response, { 'controller' : 'posts' });
	});
}

exports.edit = function(request, response, id) {
	var data = request.data;

	// Find the post data since nothing has been POSTed
	if (typeof data === 'undefined' && !data) {
		PostsController.Post.find('first', {
			'conditions' : {
				'id' : id
			}
		}, function(results) {
			// Send this function's code to the view for display in "Code for this controller action:"
			results.controllerActionCode = exports.edit.toString();

			// Send the results to render the view
			PostsController.set(request, response, results);
		});
	} else {
		PostsController.Post.save(data, function(info) {
			request.flash('info', 'Post has been edited.');
			PostsController.redirect(response, { 'action' : 'view', 'id' : data.Post.id });
		});
	}
}

exports.remove = function(request, response, id) {
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