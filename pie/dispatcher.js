exports.setup = function () {
	var sys       = require('sys');
	var appRoutes = require(pie.paths.app.config.routes).routes;

	// Use default port of 3000 unless specified in config.js
	var port = 3000;
	if (typeof pie.config.app.core.port !== 'undefined' && pie.config.app.core.port && typeof pie.config.app.core.port === 'number') {
		port = pie.config.app.core.port;
	}
	server.listen(port, function() { sys.log('PieJS running at http://localhost:' + port + pie.config.app.core.webroot); });

	if (appRoutes.length >= 1) {
		appRoutes.forEach(function(appRoute) {
			appRoute();
		});
	}

	/**
	 * Redirects http://www.example.com/ -> http://www.example.com/pages/home
	 *
	 * 2011-05-24 09.32.10 - Justin Morris
	 */
	server.get(pie.config.app.core.webroot, function(request, response, next) {
		var params = request.params;

		if (params) {
			response.redirect(pie.config.app.core.webroot + '/pages/home');
		} else {
			next();
		}
	});

	/**
	 * Serves pages in app/views/pages for http://www.example.com/pages/*
	 *
	 * 2011-05-24 09.33.32 - Justin Morris
	 */
	server.get(pie.config.app.core.webroot + 'pages/*', function(request, response, next) {
		var params = request.params;

		if (params) {
			server.set('views', pie.paths.app.views.pages);
			server.set('view engine', pie.config.app.core.viewEngine);

			response.render(params[0], {
				'layout' : pie.paths.app.views.layouts + 'default'  + '.' + pie.config.app.core.viewEngine,
				'locals' : {
					'flash' : request.flash()
				}
			});
		} else {
			next();
		}
	});

	/**
	 * Exposes the files in app/public/
	 *
	 * TODO: Sanitization should probably happen on the file variable?
	 *
	 * 2011-05-24 09.34.45 - Justin Morris
	 */
	server.get(pie.config.app.core.webroot + 'public/*', function(request, response, next) {
		var params = request.params;
		var file   = params[0];

		if (params) {
			var mime        = require(pie.paths.pie.modules.mime);
			var fs          = require('fs');
			var contentType = mime.lookup(file);

			fs.readFile(pie.paths.app.public.path + file, function(error, data) {
				response.header('Content-Type', contentType);
				response.send(data);
			});
		} else {
			next();
		}
	});

	/**
	 * Main GET routing for Pie.
	 *
	 * The controller is loaded and the action is called. The request, response, and id (see below)
	 * are passed.
	 *
	 * TODO: Allow for more named params pass 'id'.
	 *
	 * 2011-05-24 09.37.25 - Justin Morris
	 */
	server.get(pie.config.app.core.webroot + ':controller/:action?/:id?', function(request, response, next) {
		handleAppControllerAction(request, response, next);
	});

	/**
	 * Main POST routing for Pie.
	 *
	 * The controller is loaded and the action is called. The request, response, and id (see below)
	 * are passed.
	 *
	 * TODO: Allow for more named params pass 'id'.
	 *
	 * 2011-05-24 09.44.25 - Justin Morris
	 */
	server.post(pie.config.app.core.webroot + ':controller/:action/:id?', function(request, response, next) {
		handleAppControllerAction(request, response, next);
	});
}

/**
 * Handles the common logic for the main routing of GET and POST for PieJS.
 *
 * 2011-06-07 14.33.29 - Justin Morris
 */
var handleAppControllerAction = function(request, response, next) {
	if (typeof request.params.action === 'undefined') {
		request.params.action = 'index';
	}

	if (typeof request.params.id === 'undefined') {
		request.params.id = null;
	}

	var	params     = request.params;
	var controller = Sanitize.dispatcher(params.controller);
	var action     = Sanitize.dispatcher(params.action);
	var id         = Sanitize.dispatcher(params.id);

	if (controller && action) {
		var controllerFile   = pie.paths.app.controllers + controller + '_controller';
		var controllerExists = false;
		var actionExists     = false;

		// Check whether the requested controller exists
		try	{
			if (require(controllerFile)) {
				controllerExists = true;
			}
		} catch(e) {}

		// If the controller exists, move onto the action
		if (controllerExists) {
			var requiring = require(controllerFile)[action];

			// Check whether the requested action exists
			if (requiring) {

				// If there is data being posted, move it into the model name;
				if (request.body) {
					var data   = {};
					var values = request.body;

					Object.keys(values).forEach(function(key) {
						var value = values[key];
						var keys  = key.split('.');
						var model = keys[1];
						var field = keys[2];

						if (typeof data[model] === 'undefined' && !data[model]) {
							data[model] = {};
						}

						data[model][field] = value;
					});

					request.body = undefined;
					request.data = data;
				}

				requiring(request, response, id);

			// The action for the controller could not be found
			} else {
				response.send('Cannot find the requested action.');
			}

		// The controller could not befound
		} else {
			response.send('Cannot find the requested controller.');
		}

	} else {
		next();
	}
}