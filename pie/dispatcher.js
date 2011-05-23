exports.setup = function () {

	// Use default port of 3000 unless specified in sites/config.js
	var port = 3000;
	if (typeof config.core.port !== 'undefined' && config.core.port && typeof config.core.port === 'number') {
		port = config.core.port;
	}

	server.listen(port, function() {
		console.log('server running at http://localhost:' + port + '\n');
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
			setupSiteConfig(site);

			server.set('views', config.paths.sites[site].views.pages);
			server.set('view engine', config.sites[site].core.viewEngine);

			response.render(params[0], {
				'layout' : config.paths.sites[site].views.layouts + 'default'  + '.' + config.sites[site].core.viewEngine,
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
		var site   = params.site;
		var file   = params[0];

		if (params) {
			var mime        = require(config.paths.pie.modules.mime);
			var fs          = require('fs');
			var contentType = mime.lookup(file);

			setupSiteConfig(site);

			fs.readFile(config.paths.sites[site].public.path + file, function(error, data) {
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
			setupSiteConfig(site);

			console.log('dispatcher.get:', request.params, '\n');
			require(config.paths.sites[site].controllers + controller + '_controller')[action](request, response, id);
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
			setupSiteConfig(site);

			console.log('dispatcher.post:', request.params, '\n');
			require(config.paths.sites[site].controllers + controller + '_controller')[action](request, response, id);
		} else {
			next();
		}
	});
}

function setupSiteConfig (name) {

	// Setup paths for the site if not already set
	if (typeof config.paths.sites[name] === 'undefined' && !config.paths.sites[name]) {
		config.paths.sites[name] = {
			'path' : __dirname + '/../sites' + name + '/',
			'config' : {
				'path'     : __dirname + '/../sites/' + name + '/config/',
				'core'     : __dirname + '/../sites/' + name + '/config/core.js',
				'database' : __dirname + '/../sites/' + name + '/config/database.js'
			},
			'models' : __dirname + '/../sites/' + name + '/models/',
			'controllers' : __dirname + '/../sites/' + name + '/controllers/',
			'views' : {
				'path'    : __dirname + '/../sites/' + name + '/views',
				'layouts' : __dirname + '/../sites/' + name + '/views/layouts/',
				'pages'   : __dirname + '/../sites/' + name + '/views/pages'
			},
			'public' : {
				'path'        : __dirname + '/../sites/' + name + '/public/',
				'images'      : __dirname + '/../sites/' + name + '/public/images/',
				'javascripts' : __dirname + '/../sites/' + name + '/public/javascripts/',
				'stylesheets' : __dirname + '/../sites/' + name + '/public/stylesheets/'
			}
		};
	}

	// Setup core and database for the site if not already set
	if (typeof config.sites[name] === 'undefined' && !config.sites[name]) {
		config.sites[name] ={
			'core'     : require(config.paths.sites[name].config.core).core,
			'database' : require(config.paths.sites[name].config.database).database
		};
	}
}