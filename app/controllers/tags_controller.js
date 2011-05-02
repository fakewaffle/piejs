var TagsController = new Controller('Tag');

TagsController.view = function(request, response, id) {
	TagsController.Tag.once('find', function(results) {

		console.log(results);

		TagsController.set(request, response, results);
	});

	TagsController.Tag.find('first', {
		'conditions' : {
			'id' : id,
		},
		'fields' : [
			'name'
		]
	});
};
exports.view = TagsController.view;