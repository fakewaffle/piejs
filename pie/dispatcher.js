function setup() {
	server.get('/', function(request, response, next) {
		var params = request.params;

		if (params.length == 0) {
			console.log('dispatcher:\nin "/" and params.length is 0')
			// require('./controllers/pages')[action](id);
		} else { next(); }
	});

	server.get('/:controller/:action/:id?', function(request, response, next) {
		var	params     = request.params,
			controller = params.controller,
			action     = params.action,
			id         = params.id;

		if (debug == true) { console.log('dispatcher:', params, '\n'); }

		if (controller && action) {
			// try {
				require('../app/controllers/' + controller + '_controller')[action](request, response, id);
			// } catch (error) { sendError(error, response); }
		} else { next(); }
	});
}
exports.setup = setup;

// function sendError(error, response) {
// 	console.log(error);
// 	response.send(error.toString());
// };