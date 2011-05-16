function setup() {
	var express = require('express');
	var server  = express.createServer(express.favicon(), express.bodyParser());
	var port    = 3000;

	if (typeof config.app.core.port != 'undefined' && config.app.core.port && typeof config.app.core.port == 'number') {
		port = config.app.core.port;
	}

	server.set('view engine', config.app.core.viewEngine);
	server.set('views', config.paths.app.views.path);

	server.listen(port, function() {
		console.log('Server running at http://localhost:' + port + '\n');
	});

	server.get('/', function(request, response, next) {
		var params = request.params;

		if (params.length == 0) {
			console.log('dispatcher:\nin "/" and params.length is 0')
			// require('./controllers/pages')[action](id);
		} else {
			next();
		}
	});

	server.get('/:controller/:action?/:id?', function(request, response, next) {
		if (typeof request.params.action == 'undefined') {
			request.params.action = 'index';
		}

		if (typeof request.params.id == 'undefined') {
			request.params.id = null;
		}

		var	params     = request.params,
			controller = Sanitize.dispatcher(params.controller),
			action     = Sanitize.dispatcher(params.action),
			id         = Sanitize.dispatcher(params.id);

		if (debug == true) {
			console.log('dispatcher:', request.params, '\n');
		}

		if (controller && action) {
			try {
				require(config.paths.app.controllers + controller + '_controller')[action](request, response, id);
			} catch (error) {
				console.log('dispatcher error:', error, '\n');
			}
		} else { next(); }
	});

	server.post('/:controller/:action/:id?', function(request, response, next) {
		if (typeof request.params.id == 'undefined') {
			request.params.id = null;
		}

		var	params     = request.params,
			controller = Sanitize.dispatcher(params.controller),
			action     = Sanitize.dispatcher(params.action),
			id         = Sanitize.dispatcher(params.id);

		if (debug == true) {
			console.log('dispatcher:', request.params, '\n');
		}

		if (controller && action) {
			try {
				require(config.paths.app.controllers + controller + '_controller')[action](request, response, id);
			} catch (error) {
				console.log('dispatcher error:', error, '\n');
			}
		} else { next(); }
	});
}
exports.setup = setup;