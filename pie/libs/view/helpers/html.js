/**
 * Html helper.
 *
 * Convenience function for creating html entities with PieJS conventions.
 *
 * @param string model Model name
 *
 * @author Justin Morris
 * @created 2011-05-25 11.23.13
 */
function Html(model) {
	this.controller = Inflector.tableize(model.toLowerCase());
	this.webroot    = pie.config.app.core.webroot;
}

/**
 * Convenience helper to create links using PieJS conventions.
 *
 * TODO: Add a lost param (bool) for full url (ex: http://www.example.com/site/controller/action/etc...)
 *
 * @param string text Link text
 * @param object OR string hrefs If hrefs is an object, construct the URL with convention and passed params. If hrefs is a string use it for the URL.
 * @param object attributes Html attributes
 * @return string
 *
 * @author Justin Morris
 * @created 2011-05-25 11.23.10
 */
Html.prototype.link = function(text, hrefs, attributes) {
	var html = '<a href="';

	if (typeof hrefs === 'object') {
		var controller = hrefs.controller;
		var action     = hrefs.action;

		html += this.webroot;
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
 * @return string
 *
 * @author Justin Morris
 * @created 2011-05-26 16.19.21
 */
Html.prototype.css = function(file) {
	var localStyleSheet = '';

	if (!file.match(/^http/)) {
		localStyleSheet = this.webroot + 'public/stylesheets/';
	}

	return '<link rel="stylesheet" href="' + localStyleSheet + file + '" type="text/css">';
}

/**
 * Creats a link for a javascript file.
 *
 * @param string file File name to provide link for
 * @return string
 *
 * @author Justin Morris
 * @created 2011-05-26 16.20.27
 */
Html.prototype.js = function(file) {
	var localJavaScript = '';

	if (!file.match(/^http/)) {
		localJavaScript = this.webroot + 'public/javascripts/';
	}

	return '<script src="' + localJavaScript + file + '" type="text/javascript"></script>';
}

exports.Html = Html;