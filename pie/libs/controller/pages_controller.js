var PagesController = exports.PagesController = new Controller({
	'name' : 'Page',
	'helpers' : [
		'Html'
	]
});

exports.display = function(request, response) {
    PagesController.set(request, response, {});
};