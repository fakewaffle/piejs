exports.setup = function () {

	// Use default port of 3000 unless specified in sites/pie.config.js
	var port = 3000;
	if (typeof pie.config.core.port !== 'undefined' && pie.config.core.port && typeof pie.config.core.port === 'number') {
		port = pie.config.core.port;
	}

	server.listen(port, function() {
		console.log('server running at http://localhost:' + port);
	});

	server.get('/:site', function(request, response, next) {
		var params = request.params;
		var site   = params.site;

		if (params) {
			response.redirect(site + '/pages/home');
		} else {
			next();
		}
	});

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

	// Main routing for Pie. TODO: allow for more named params pass 'id'
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