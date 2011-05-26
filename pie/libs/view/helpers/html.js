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
 * @param object OR string hrefs If hrefs is an object, construct the URL with convention and passed params. If hrefs is a string use it for the URL.
 * @param object attributes Html attributes
 *
 * TODO: All another param for full url.
 * 2011-05-25 11.23.10 - Justin Morris
 */
Html.prototype.link = function(text, hrefs, attributes) {
	var html = '<a href="';

	if (typeof hrefs === 'object') {
		var site       = hrefs.site;
		var controller = hrefs.controller;
		var action     = hrefs.action;

		html += '/';
		if (typeof site !== 'undefined' && site) {
			html += site;
		} else {
			html += this.site;
		}
		delete(hrefs.site);
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

exports.Html = Html;