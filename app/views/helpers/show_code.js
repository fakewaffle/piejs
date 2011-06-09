/**
* Helper to expose code in /piejs/app.
*
* @param string model Model name
* @param object params Params including esults from a Model.find(), and request from express
*
* 2011-05-25 22.18.01 - Justin Morris
 */
function ShowCode(model, params) {
	this.modelName      = model;
	this.controllerName = params.request.controller;
	this.actionName     = params.request.action;
	this.modelFile      = pie.paths.app.models + Inflector.singularize(Inflector.tableize(this.modelName)) + '.js';
	this.controllerFile = pie.paths.app.controllers + Inflector.tableize(this.modelName) + '_controller' + '.js';
	this.viewFile       = pie.paths.app.views.path + '/' + Inflector.tableize(this.modelName) + '/' + this.actionName + '.ejs';
}

/**
 * Show the current model code.
 *
 * 2011-06-03 00.22.21 - Justin Morris
 */
ShowCode.prototype.model = function() {
	var fs = require('fs');

	return '<div class="code">' +
		'<h3>Code for the ' + this.modelName + ' Model:</h3>' +
		'<pre class="syntax javascript">' +
			fs.readFileSync(this.modelFile, 'utf8') +
		'</pre>' +
	'</div>';
}

/**
 * Show the current controller code.
 *
 * 2011-06-03 00.22.33 - Justin Morris
 */
ShowCode.prototype.controller = function() {
	var fs = require('fs');

	return '<div class="code">' +
		'<h3>Code for the ' + Inflector.pluralize(this.modelName) + 'Controller:</h3>' +
		'<pre class="syntax javascript">' +
			fs.readFileSync(this.controllerFile, 'utf8') +
		'</pre>' +
	'</div>';
}

/**
 * Show the current controller action code.
 *
 * 2011-06-03 00.22.40 - Justin Morris
 */
ShowCode.prototype.controllerAction = function() {
	return '<div class="code">' +
		'<h3>Code for the "' + this.actionName + '" action in the ' + Inflector.pluralize(this.modelName) + 'Controller:</h3>' +
		'<pre class="syntax javascript">' +
			require(this.controllerFile)[this.actionName] +
		'</pre>' +
	'</div>' ;
}

/**
 * Show the current view code.
 *
 * 2011-06-03 00.23.00 - Justin Morris
 */
ShowCode.prototype.view = function() {
	var fs = require('fs');

	return '<div class="code">' +
		'<h3>Code for this view:</h3>' +
		'<pre class="syntax javascript">' +
			encodeEntities(fs.readFileSync(this.viewFile, 'utf8')) +
		'</pre>' +
	'</div>';
}

/**
 * Shows a link to the GitHub repo for PieJS.
 *
 * 2011-06-03 09.20.09 - Justin Morris
 */
ShowCode.prototype.githubLink = function() {
	return '<div class="code">' +
		'<div class="pre align-center"><a href="https://github.com/fakewaffle/piejs">View the full source code.</a></div>' +
	'</div>';
}

/**
 * Standard way to show code for a view.
 *
 * 2011-06-03 09.13.23 - Justin Morris
 */
ShowCode.prototype.standard = function() {
	return this.view() + this.controllerAction() + this.model() + this.githubLink();
}

/**
 * Encode the basic HTML characters into entities.
 *
 * @param string string String to encode
 *
 * 2011-06-03 09.01.57 - Justin Morris
 */
var encodeEntities = function(string) {
	var encodeString = '';

	for (var i = 0; i < string.length; i++) {
		var character = string.charAt(i);
		encodeString += { '<' : '&lt;', '>' : '&gt;', '&' : '&amp;', '"' : '&quot;' }[character] || character;
	}

	return encodeString;
}

exports.ShowCode = ShowCode;