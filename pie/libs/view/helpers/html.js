/**
 * Html helper.
 *
 * Convenience function for creating html entities with PieJS conventions.
 *
 * @param string model Model name
 *
 * 2011-05-25 11.23.13 - Justin Morris
 */
function Html(model) {
	this.controller = model.toLowerCase().tableize();
}

/**
 * Convenience helper to create links using PieJS conventions.
 *
 * @param string text Link text
 * @param object OR string hrefs If hrefs is an object, construct the URL with convention and passed params. If hrefs is a string use it for the URL.
 * @param object attributes Html attributes
 *
 * TODO: All another param for full url.
 * 2011-05-25 11.23.10 - Justin Morris
 */
Html.prototype.link = function(text, hrefs, attributes) {
	var html = '<a href="';

	if (typeof hrefs === 'object') {
		var controller = hrefs.controller;
		var action     = hrefs.action;

		html += '/';
		if (typeof controller !== 'undefined' && controller) {
			html += controller
		} else {
			html += this.controller;
		}
		delete(hrefs.controller);
		html += '/';

		if (typeof action !== 'undefined' && action) {
			html += action;
		}
		delete(hrefs.action);

		if (hrefs) {
			Object.keys(hrefs).forEach(function(key) {
				var href = hrefs[key];

				if (key === 'id') {
					html += '/' + href;
				} else {
					html += '/' + key + ':' + href
				}
			});
		} else {
			html += '/';
		}
	} else if (typeof hrefs === 'string') {
		html += hrefs;
	}

	html += '"';

	if (typeof attributes !== 'undefined' && attributes) {
		Object.keys(attributes).forEach(function(key) {
			var attribute = attributes[key];
			html += ' ' + key + '="' + attribute + '"';
		});
	}

	return html += '>' + text + '</a>';
}

/**
 * Creates a link for a stylesheet.
 *
 * @param string file File name to provide link for
 *
 * 2011-05-26 16.19.21 - Justin Morris
 */
Html.prototype.css = function(file) {
	return '<link rel="stylesheet" href="' + '/public/stylesheets/' + file + '.css" type="text/css">';
}

/**
 * Creats a link for a javascript file.
 *
 * @param string file File name to provide link for
 *
 * 2011-05-26 16.20.27 - Justin Morris
 */
Html.prototype.js = function(file) {
	return '<script src="' + '/public/javascripts/' + file + '.js" type="text/javascript"></script>';
}

exports.Html = Html;