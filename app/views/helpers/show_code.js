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
	this.controllerName = params.request.params.controller;
	this.actionName     = params.request.params.action;
	this.modelFile      = pie.paths.app.models + Inflector.singularize(Inflector.tableize(this.modelName)) + '.js';
	this.controllerFile = pie.paths.app.controllers + Inflector.tableize(this.modelName) + '_controller' + '.js';
	this.viewFile       = pie.paths.app.views.path + '/' + Inflector.tableize(this.modelName) + '/' + this.actionName + '.ejs';
}

/**
 * Show the current model code
 *
 * 2011-06-03 00.22.21 - Justin Morris
 */
ShowCode.prototype.model = function() {
	var fs = require('fs');

	var html = '<div class="code">';
			html += '<h3>Code for the ' + this.modelName + ' Model:</h3>';
			html += '<pre>'
				html += fs.readFileSync(this.modelFile, 'utf8');
			html += '</pre>'
		html += '</div>'

	return html;
}

/**
 * Show the current controller code
 *
 * 2011-06-03 00.22.33 - Justin Morris
 */
ShowCode.prototype.controller = function() {
	var fs = require('fs');

	var html = '<div class="code">';
			html += '<h3>Code for the ' + Inflector.pluralize(this.modelName) + 'Controller:</h3>';
			html += '<pre>'
				html += fs.readFileSync(this.controllerFile, 'utf8');
			html += '</pre>'
		html += '</div>'

	return html;
}

/**
 * Show the current controller action code
 *
 * 2011-06-03 00.22.40 - Justin Morris
 */
ShowCode.prototype.controllerAction = function() {
	var html = '<div class="code">';
			html += '<h3>Code for the "' + this.actionName + '" action in the ' + Inflector.pluralize(this.modelName) + 'Controller:</h3>';
			html += '<pre>'
				html += require(this.controllerFile)[this.actionName];
			html += '</pre>'
		html += '</div>'

	return html;
}

/**
 * Show the current view code
 *
 * TODO: Make this work. Needs to be escaped with HTML entities, but not the <pre> tags.
 *
 * 2011-06-03 00.23.00 - Justin Morris
 */
ShowCode.prototype.view = function() {
	var fs = require('fs');

	var html = '<div class="code">';
			html += '<h3>Code for this view:</h3>';
			html += '<pre class="reset">'
				html += fs.readFileSync(this.viewFile, 'utf8');
			html += '</pre>'
		html += '</div>'

	return html;
}

exports.ShowCode = ShowCode;