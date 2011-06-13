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
	this.controller = Inflector.tableize(model.toLowerCase());
	this.webroot    = pie.config.app.core.webroot;
}

/**
 * Internal function to create elements.
 *
 * @param string tag the html tag to output. e.g. 'a' or 'img'
 * @param object attributes the html element attributes. e.g. {style: 'color: red;', href: 'http:google.com'}
 * @param string content string of tag contents. e.g. 'Welcome!'
 *
 * 2011-06-13 18.13.00 - Rasmus Berg Palm
 */
Html.prototype.element = function(tag, attributes, content) {
    var html = '';
    html += '<'+tag;
    
    if (typeof attributes !== 'undefined' && attributes) {
		Object.keys(attributes).forEach(function(key) {
			var attribute = attributes[key];
			html += ' ' + key + '="' + attribute + '"';
		});
	}
	
	if (typeof content !== 'undefined' && content) {
        html += '>' + content + '</'+tag+'>';
	}else{
	    html += ' />';
	}

	return html;
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

    if (typeof attributes !== 'object')
        attributes = {};

    var url = '';
	if (typeof hrefs === 'object') {
		var controller = hrefs.controller;
		var action     = hrefs.action;

		url += this.webroot;
		if (typeof controller !== 'undefined' && controller) {
			url += controller
		} else {
			url += this.controller;
		}
		delete(hrefs.controller);
		url += '/';

		if (typeof action !== 'undefined' && action) {
			url += action;
		}
		delete(hrefs.action);

		if (hrefs) {
			Object.keys(hrefs).forEach(function(key) {
				var href = hrefs[key];

				if (key === 'id') {
					url += '/' + href;
				} else {
					url += '/' + key + ':' + href
				}
			});
		} else {
			url += '/';
		}
	} else if (typeof hrefs === 'string') {
		url += hrefs;
	}
	attributes.href = url;

	return this.element('a', attributes, text);
}

/**
 * Convenience helper to create images using PieJS conventions.
 *
 * @param string file image file
 * @param object attributes Html attributes
 *
 * 2011-06-13 18.13.00 - Rasmus Berg Palm
 */
Html.prototype.image = function(file, attributes) {
    var local = '';
    
    if (typeof attributes !== 'object'){
        attributes = {};
    }

    if (!file.match(/^http/)) {
		local = this.webroot + 'public/images/';
	}
	
    attributes.src = local+file;
    return this.element('img', attributes);
}

/**
 * Creates a link for a stylesheet.
 *
 * @param string file File name to provide link for
 *
 * 2011-05-26 16.19.21 - Justin Morris
 */
Html.prototype.css = function(file) {
	var local = '';

	if (!file.match(/^http/)) {
		local = this.webroot + 'public/stylesheets/';
	}
    attributes = {rel: 'stylesheet', href: local+file, type:'text/css'};
    return this.element('link', attributes);
}

/**
 * Creats a link for a javascript file.
 *
 * @param string file File name to provide link for
 *
 * 2011-05-26 16.20.27 - Justin Morris
 */
Html.prototype.js = function(file) {
	var local = '';

	if (!file.match(/^http/)) {
		local = this.webroot + 'public/javascripts/';
	}
    attributes = {src: local+file, type:'text/javascript'};
    return this.element('script', attributes, ' ');
}

exports.Html = Html;
