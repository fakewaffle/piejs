exports.routes = [
	function() {
		server.get(pie.config.app.core.webroot + 'show-code/:folder/*', function(request, response, next) {
			var params = request.params;
			var folder = Sanitize.dispatcher(params.folder);
			var file   = params[0];

			if (params && typeof folder !== 'undefined' && folder && folder !== 'config') {
				var fs = require('fs');

				fs.readFile(pie.paths.app.path + folder + '/' + file, function(error, data) {
					response.header('Content-Type', 'text/plain');
					response.send(data);
				});
			} else {
				next();
			}
		});
	}
];