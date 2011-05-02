var TagsController = new Controller('Tag');

TagsController.view = function(request, response, id) {
	TagsController.Tag.once('find', function(data) {
		TagsController.set(request, response, data);
	});

	TagsController.Tag.find(id);
};
exports.view = TagsController.view;