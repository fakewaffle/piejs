var PagesController = exports.PagesController = new Controller({
	'name' : 'Post',
	'helpers' : [
		'Html',
		'ShowCode'
	]
});

exports.display = function(request, response) {
    PagesController.set(request, response, {});
};