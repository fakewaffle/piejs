/**
 * Html helper.
 *
 * Convenience function for creating html entities with PieJS conventions.
 *
 * @param string model Model name
 * @param string site Site name
 *
 * 2011-05-25 11.23.13 - Justin Morris
 */
function Html(model, site) {
	this.controller = model.toLowerCase().tableize();
	this.site       = site;
}

/**
 * Convenience helper to create links using PieJS conventions.
 *
 * @param string text Link text
 * @param object OR string links If links is an object, construct the URL with convention and passed params. If links is a string use it for the URL.
 * @param object attributes Html attributes
 *
 * TODO: All another param for full url.
 * 2011-05-25 11.23.10 - Justin Morris
 */
Html.prototype.link = function(text, links, attributes) {
	var html = '<a href="';

	if (typeof links === 'object') {
		var site       = links.site;
		var controller = links.controller;
		var action     = links.action;

		html += '/';
		if (typeof site !== 'undefined' && site) {
			html += site;
		} else {
			html += this.site;
		}
		delete(links.site);
		html += '/';

		if (typeof controller !== 'undefined' && controller) {
			html += controller
		} else {
			html += this.controller;
		}
		delete(links.controller);
		html += '/';

		if (typeof action !== 'undefined' && action) {
			html += action;
		}
		delete(links.action);

		if (links) {
			Object.keys(links).forEach(function(key) {
				var link = links[key];

				if (key === 'id') {
					html += '/' + link;
				} else {
					html += '/' + key + ':' + link
				}
			});
		} else {
			html += '/';
		}
	} else if (typeof links === 'string') {
		html += links;
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

exports.Html = Html;