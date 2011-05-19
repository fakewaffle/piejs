function setup() {
	var express = require('express');
	var server  = express.createServer(
		express.favicon(),
		express.cookieParser(),
		express.session({ secret: config.app.core.secret }),
		express.bodyParser()
	);

	// Use default port of 3000 unless specified in app/config/core.js
	var port    = 3000;
	if (typeof config.app.core.port != 'undefined' && config.app.core.port && typeof config.app.core.port == 'number') {
		port = config.app.core.port;
	}

	// TODO: Allow users to specify their own view engine in app/config/core.js
	server.set('view engine', config.app.core.viewEngine);
	server.set('views', config.paths.app.views.path);

	server.listen(port, function() {
		console.log('Server running at http://localhost:' + port + '\n');
	});

	// TODO: Anything not matching a controller in app/controllers should be handled by pie/controller/pages_controller.js
	// and server pages from app/views/pages
	server.get('/', function(request, response, next) {
		var params = request.params;

		if (params.length == 0) {
			console.log('dispatcher:\nin "/" and params.length is 0')
			// require('./controllers/pages')[action](id);
		} else {
			next();
		}
	});

	// Main routing for Pie. TODO: allow for more named params pass 'id'
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
			console.log('dispatcher.get:', request.params, '\n');
		}

		// If there is a controller and an action, load the controller frm app/controllers/ and call the exported action
		if (controller && action) {
			require(config.paths.app.controllers + controller + '_controller')[action](request, response, id);
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
			console.log('dispatcher.post:', request.params, '\n');
		}

		if (controller && action) {
			require(config.paths.app.controllers + controller + '_controller')[action](request, response, id);
		} else { next(); }
	});
}
exports.setup = setup;