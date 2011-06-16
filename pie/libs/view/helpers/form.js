/**
* Form helper.
*
* Convenience function for creating form elements with PieJS conventions.
*
* @param string model Model name
* @param object params Params including esults from a Model.find(), and request from express
*
* @author Justin Morris
* @created 2011-05-25 22.18.01
 */
var Form = exports.Form = function(model, params) {
	this.model      = model;
	this.controller = Inflector.tableize(model.toLowerCase());
	this.action     = params.request.action;
	this.webroot    = pie.config.app.core.webroot;
	this.results    = params.results;
}

/**
 * Convenience helper to create a starting form tag using PieJS conventions.
 *
 * @param object OR string links If links is an object, construct the ACTION with convention and passed params. If links is a string use it for the ACTION.
 * @param object attributes Html attributes
 * @return string
 *
 * @author Justin Morris
 * @created 2011-05-25 22.19.30
 */
Form.prototype.create = function(links, attributes) {
	var html  = '<form ';

	if (typeof attributes === 'undefined' || typeof attributes.method === 'undefined') {
		html += 'method="POST" ';
	}

	if (typeof links === 'object') {
		var controller = links.controller;
		var action     = links.action;

		html += 'action="' + this.webroot;
		if (typeof controller !== 'undefined' && controller) {
			html += controller
		} else {
			html += this.controller;
		}
		delete(links.controller);
		html += '/';

		if (typeof action !== 'undefined' && action) {
			html += action;
		} else {
			html += this.action;
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

	return html += this._constructAttributes(attributes) + '>';
}

/**
 * Creates a closing tag for a form with an optional submit button.
 *
 * @param string submitButtonValue Value for the optional submit button
 * @return string
 *
 * @author Justin Morris
 * @created 2011-05-25 23.10.58
 */
Form.prototype.end = function(submitButtonValue) {
	var html = '';

	if (typeof submitButtonValue !== 'undefined' && typeof submitButtonValue === 'string') {
		html += '<input type="submit" value="' + submitButtonValue + '" />';
	}

	return html += '</form>';
}

/**
 * Convenience function to create an input tag using PieJS conventions.
 *
 * @param string field Value for the name attribute
 * @param object options Options for creating the input
 * @param object attributes Html attributes
 * @return string
 *
 * @author Justin Morris
 * @created 2011-05-30 20.03.48
 */
Form.prototype.input = function(field, options, attributes) {
	var modelData = this.results[this.model];

	var labelHtml = '';
	var labelText = Inflector.titleize(field);
	var showLabel = true;

	var inputHtml = '';
	var type      = 'text';
	var id        = this.model + Inflector.classify(field);
	var name      = this.model + '[' + field + ']';

	if (typeof attributes != 'undefined' && attributes) {
		if (typeof attributes.type != 'undefined' && attributes.type) {
			type = attributes.type;
		}
		delete(attributes.type)
	}

	if (typeof options != 'undefined' && options) {
		if (typeof options.label != 'undefined' && options.label === false) {
			showLabel = false;
		} else if (typeof options.label === 'string' && options.label) {
			labelText = options.label
		}
	}

	if (showLabel === true) {
		labelHtml = '<label for="' + id + '">' + labelText + '</label>';
	}

	inputHtml = '<input type="' + type + '" id="' + id + '" name="' + name + '"';

	if (typeof modelData !== 'undefined' && modelData && typeof modelData[field] !== 'undefined' && modelData[field]) {
		inputHtml += ' value="' + modelData[field] + '"';
	}

	inputHtml += this._constructAttributes(attributes) + '>';

	return labelHtml + inputHtml;
}

/**
 * Convenience wrapper to create hidden input fields.
 *
 * @param string field Value for the name attribute
 * @param object options Options for creating the input
 * @param object attributes Html attributes
 * @return string
 *
 * @author Justin Morris
 * @created 2011-05-30 21.01.34
 */
Form.prototype.hidden = function (field, options, attributes) {
	if (typeof options === 'undefined') {
		options = {};
	}
	options.label = false;

	if (typeof attributes === 'undefined') {
		attributes = {};
	}
	attributes.type = 'hidden';

	return this.input(field, options, attributes);
}

/**
 * Constructs the HTML for attributes.
 *
 * @param object attributes HTML attributes to create
 * @return string
 *
 * @author Justin Morris
 * @created 2011-05-30 21.01.34
 */
Form.prototype._constructAttributes = function(attributes) {
	var attributesHtml = '';

	if (typeof attributes !== 'undefined' && attributes) {
		Object.keys(attributes).forEach(function(key) {
			var attribute = attributes[key];
			attributesHtml += ' ' + key + '="' + attribute + '"';
		});
	}

	return attributesHtml;
}