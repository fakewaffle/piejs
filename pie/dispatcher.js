exports.dispatch = function () {

	// Use default port of 3000 unless specified in config.js
	var port = 3000;
	if (typeof pie.config.app.core.port !== 'undefined' && pie.config.app.core.port && typeof pie.config.app.core.port === 'number') {
		port = pie.config.app.core.port;
	}
	server.listen(port, function() { pie.sys.log('PieJS running at http://localhost:' + port + pie.config.app.core.webroot); });

	if (pie.app.routes.length >= 1) {
		pie.app.routes.forEach(function(appRoute) {
			appRoute();
		});
	}

	/**
	 * http://www.example.com/ shows http://www.example.com/pages/home
	 *
	 * @author Justin Morris
	 * @created 2011-05-24 09.32.10
	 */
	server.get(pie.config.app.core.webroot, function(request, response, next) {
		var params = request.params;

		if (params) {
			request.params[1] = 'home';
            request.params[0] = 'pages';

            handleAppControllerAction(request, response, next);
		} else {
			next();
		}
	});

	/**
	 * Serves pages in app/views/pages for http://www.example.com/pages/*
	 *
	 * @author Justin Morris
	 * @created 2011-05-24 09.33.32
	 */
	server.get(pie.config.app.core.webroot + 'pages/*', function(request, response, next) {
        var params = request.params;

		if (params) {
            request.params[1] = request.params[0];
            request.params[0] = 'pages';

            handleAppControllerAction(request, response, next);
		} else {
			next();
		}
	});

	/**
	 * Exposes the files in app/public/
	 *
	 * TODO: Sanitization should probably happen on the file variable?
	 *
	 * @author Justin Morris
	 * @created 2011-05-24 09.34.45
	 */
	server.get(pie.config.app.core.webroot + 'public/*', function(request, response, next) {
		var params = request.params;
		var file   = params[0];

		if (params) {
			var contentType = pie.mime.lookup(file);

			pie.fs.readFile(pie.paths.app.public.path + file, function(error, data) {
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
	 * @author Justin Morris
	 * @created 2011-05-24 09.37.25
	 */
	server.get(new RegExp(pie.config.app.core.webroot + '([^/]+)/?([^/]+)?/?(.+)?', 'i'), function(request, response, next) {
		handleAppControllerAction(request, response, next);
	});

	/**
	 * Main POST routing for Pie.
	 *
	 * The controller is loaded and the action is called. The request, response, and id (see below)
	 * are passed.
	 *
	 * @author Justin Morris
	 * @created 2011-05-24 09.44.25
	 */
	server.post(new RegExp(pie.config.app.core.webroot + '([^/]+)/?([^/]+)?/?(.+)?', 'i'), function(request, response, next) {
		handleAppControllerAction(request, response, next);
	});
}

/**
 * Handles the common logic for the main routing of GET and POST for PieJS.
 *
 * @author Justin Morris
 * @created 2011-06-07 14.33.29
 */
var handleAppControllerAction = function(request, response, next) {
	var requestedController = Sanitize.dispatcher(request.params[0]);
	var requestedAction     = Sanitize.dispatcher(request.params[1]);

	if (typeof requestedAction === 'undefined') {
		requestedAction = 'index';
	}

	if (requestedController && requestedAction) {
		var controllerFile = pie.paths.app.controllers + requestedController + '_controller';
		var controller     = false;

		// Check whether the requested controller exists
		if (typeof pie.app.controllers[Inflector.camelize(requestedController + '_controller')] !== 'undefined') {
			controller = pie.app.controllers[Inflector.camelize(requestedController + '_controller')];
		}

		// If the controller exists, move onto the action
		if (controller) {
			var action = false;

			if (requestedController !== 'pages') {
				action = controller[requestedAction];
			} else {
				action = controller['display'];
			}

			// Check whether the requested action exists
			if (action) {
				var beforeFilter = controller.beforeFilter;
				var id           = null;

				// Setup ordered params and named params
				if (typeof request.params[2] !== 'undefined') {
					var	params       = request.params[2].split('/');
					var namedParams  = {};

					// If the first param is not named assume it is an id
					if (!params[0].match(':')) {
						namedParams.id = Sanitize.dispatcher(params[0]);
					}

					var count = 0;
					params.forEach(function(param) {
						if (param.match(':')) {
							var p = param.split(':');

							namedParams[Sanitize.dispatcher(p[0])] = Sanitize.dispatcher(p[1]);
							 delete(params[count]);
						}

						count ++;
					});

					request.params      = params;
					request.namedParams = namedParams;
				} else {
					request.params      = {};
					request.namedParams = {};
				}

				request.controller = requestedController;
				request.action     = requestedAction;
				request.data       = request.body;
				request.body       = undefined;

				if (beforeFilter) {
					beforeFilter(request, response, function(request, response) {
						action(request, response );
					});
				} else {
					action(request, response);
				}

			// The action for the controller could not be found
			} else {
				response.send('Cannot find the requested action in '  + controllerFile + '.');
			}

		// The controller could not be found
		} else {
			response.send('Cannot find ' + controllerFile + '.');
		}

	} else {
		next();
	}
}