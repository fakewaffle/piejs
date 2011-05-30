/**
* Form helper.
*
* Convenience function for creating form elements with PieJS conventions.
*
* @param string model Model name
*
* 2011-05-25 22.18.01 - Justin Morris
 */
function Form(model) {
	this.model      = model;
	this.controller = model.toLowerCase().tableize();
}

/**
 * Convenience helper to create a starting form tag using PieJS conventions.
 *
 * @param object OR string links If links is an object, construct the ACTION with convention and passed params. If links is a string use it for the ACTION.
 * @param object attributes Html attributes
 *
 * 2011-05-25 22.19.30 - Justin Morris
 */
Form.prototype.create = function(links, attributes) {
	var html  = '<form ';

	if (typeof attributes === 'undefined' || typeof attributes.method === 'undefined') {
		html += 'method="POST" ';
	}

	if (typeof links === 'object') {
		var controller = links.controller;
		var action     = links.action;

		html += 'action="/';
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

	return html += '>';
}

/**
 * Creates a closing tag for a form with an optional submit button.
 *
 * @param string submitButtonValue Value for the optional submit button
 *
 * 2011-05-25 23.10.58 - Justin Morris
 */
Form.prototype.end = function(submitButtonValue) {
	var html = '';

	if (typeof submitButtonValue !== 'undefined' && typeof submitButtonValue === 'string') {
		html += '<input type="submit" value="' + submitButtonValue + '" />';
	}

	return html += '</form>';
}


exports.Form = Form;