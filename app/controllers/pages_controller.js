var PagesController = exports.PagesController = new Controller({
	'name' : 'Post',
	'helpers' : [
		'Html',
		'ShowCode'
	]
});
exports.view = function(request, response) {
    request.action = request.page;
    PagesController.set(request, response, {});
};
