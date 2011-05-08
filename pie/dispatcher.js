function setup() {
	server.get('/', function(request, response, next) {
		var params = request.params;

		if (params.length == 0) {
			console.log('dispatcher:\nin "/" and params.length is 0')
			// require('./controllers/pages')[action](id);
		} else {
			next();
		}
	});

	server.get('/:controller/:action/:id?', function(request, response, next) {
		var	params     = request.params,
			controller = params.controller,
			action     = params.action,
			id         = params.id;

		if (debug == true) { console.log('dispatcher:', params, '\n'); }

		if (controller && action) {
			try {
				require(config.paths.app.controllers + controller + '_controller')[action](request, response, id);
			} catch (error) {
				console.log('dispatcher error:', error);
			}
		} else { next(); }
	});
}
exports.setup = setup;