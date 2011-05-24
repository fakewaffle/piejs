exports.setup = function () {

	// Use default port of 3000 unless specified in sites/config.js
	var port = 3000;
	if (typeof pie.config.core.port !== 'undefined' && pie.config.core.port && typeof pie.config.core.port === 'number') {
		port = pie.config.core.port;
	}
	server.listen(port, function() { console.log('server running at http://localhost:' + port); });

	/**
	 * Redirects http://www.example.com/[site]/ -> http://www.example.com/[site]/pages/home
	 *
	 * 2011-05-24 09.32.10 - Justin Morris
	 */
	server.get('/:site', function(request, response, next) {
		var params = request.params;
		var site   = params.site;

		if (params) {
			response.redirect(site + '/pages/home');
		} else {
			next();
		}
	});

	/**
	 * Serves pages in sites/[site]/views/pages for http://www.example.com/[site]/pages/*
	 *
	 * 2011-05-24 09.33.32 - Justin Morris
	 */
	server.get('/:site/pages/*', function(request, response, next) {
		var params = request.params;
		var site   = params.site;

		if (params) {
			server.set('views', pie.paths.sites[site].views.pages);
			server.set('view engine', pie.config.sites[site].core.viewEngine);

			console.log('\ndispatcher site: ' + site + ' pages:', params[0]);
			response.render(params[0], {
				'layout' : pie.paths.sites[site].views.layouts + 'default'  + '.' + pie.config.sites[site].core.viewEngine,
				'locals' : {
					'flash' : request.flash()
				}
			});
		} else {
			next();
		}
	});

	/**
	 * Exposes the files in sites/[site]/public/
	 *
	 * TODO: Sanitization should probably happen on the file variable?
	 *
	 * 2011-05-24 09.34.45 - Justin Morris
	 */
	server.get('/:site/public/*', function(request, response, next) {
		var params = request.params;
		var site   = Sanitize.dispatcher(params.site);
		var file   = params[0];

		if (params) {
			var mime        = require(pie.paths.pie.modules.mime);
			var fs          = require('fs');
			var contentType = mime.lookup(file);

			fs.readFile(pie.paths.sites[site].public.path + file, function(error, data) {
				console.log('\ndispatcher site: ' + site + ' public:', file);
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
	 * TODO: Show gracefull errors for controllers and actions that are not found.
	 *
	 * 2011-05-24 09.37.25 - Justin Morris
	 */
	server.get('/:site/:controller/:action?/:id?', function(request, response, next) {
		if (typeof request.params.action === 'undefined') {
			request.params.action = 'index';
		}
		if (typeof request.params.id === 'undefined') {
			request.params.id = null;
		}

		var	params     = request.params;
		var site       = Sanitize.dispatcher(params.site);
		var controller = Sanitize.dispatcher(params.controller);
		var action     = Sanitize.dispatcher(params.action);
		var id         = Sanitize.dispatcher(params.id);

		if (site && controller && action) {
			console.log('\ndispatcher.get:', request.params);
			require(pie.paths.sites[site].controllers + controller + '_controller')[action](request, response, id);
		} else {
			next();
		}
	});

	/**
	 * Main POST routing for Pie.
	 *
	 * The controller is loaded and the action is called. The request, response, and id (see below)
	 * are passed.
	 *
	 * TODO: Show gracefull errors for controllers and actions that are not found.
	 *
	 * 2011-05-24 09.44.25 - Justin Morris
	 */
	server.post('/:site/:controller/:action/:id?', function(request, response, next) {
		if (typeof request.params.id === 'undefined') {
			request.params.id = null;
		}

		var	params     = request.params;
		var site       = Sanitize.dispatcher(params.site);
		var controller = Sanitize.dispatcher(params.controller);
		var action     = Sanitize.dispatcher(params.action);
		var id         = Sanitize.dispatcher(params.id);

		if (site && controller && action) {
			console.log('\ndispatcher.post:', request.params);
			require(pie.paths.sites[site].controllers + controller + '_controller')[action](request, response, id);
		} else {
			next();
		}
	});
}