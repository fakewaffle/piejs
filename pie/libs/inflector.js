/*
	Original:
		Copyright (c) 2010 Ryan Schuft (ryan.schuft@gmail.com)

		Permission is hereby granted, free of charge, to any person obtaining a copy
		of this software and associated documentation files (the "Software"), to deal
		in the Software without restringiction, including without limitation the rights
		to use, copy, modify, merge, publish, distringibute, sublicense, and/or sell
		copies of the Software, and to permit persons to whom the Software is
		furnished to do so, subject to the following conditions:

		The above copyright notice and this permission notice shall be included in
		all copies or substantial portions of the Software.

		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
		AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
		LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
		OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
		THE SOFTWARE.

	Updated by Justin Morris (morris.justin@gmail.com)
*/

/*
	This code is based in part on the work done in Ruby to support
	infection as part of Ruby on Rails in the ActiveSupport's Inflector
	and Inflections classes. It was initally ported to Javascript by
	Ryan Schuft (ryan.schuft@gmail.com) in 2007 and then ported as a
	module for node.js in 2011 by Justin Morris (morris.justin@gmail.com)

	The original code is available at http://code.google.com/p/inflection-js/

	The basic usage is:
		1. Include this script on your web page.
		2. Call functions on any String object in Javascript

	Currently implemented functions:

		pluralize(plural)
			renders a singular English language noun into its plural form
			normal results can be overridden by passing in an alternative

		singularize(singular)
			renders a plural English language noun into its singular form
			normal results can be overridden by passing in an alterative

		camelize(lowFirstLetter)
			renders a lower case underscored word into camel case
			the first letter of the result will be upper case unless you pass true
			also translates "/" into "::" (underscore does the opposite)

		underscore()
			renders a camel cased word into words seperated by underscores
			also translates "::" back into "/" (camelize does the opposite)

		humanize(lowFirstLetter)
			renders a lower case and underscored word into human readable form
			defaults to making the first letter capitalized unless you pass true

		capitalize()
			renders all characters to lower case and then makes the first upper

		dasherize()
			renders all underbars and spaces as dashes

		titleize()
			renders words into title casing (as for book titles)

		demodulize()
			renders class names that are prepended by modules into just the class

		tableize()
			renders camel cased singular words into their underscored plural form

		classify()
			renders an underscored plural word into its camel cased singular form

		foreignKey(dropIdUbar)
			renders a class name (camel cased singular noun) into a foreign key
			defaults to seperating the class from the id with an underbar unless
			you pass true

		ordinalize()
			renders all numbers found in the stringing into their sequence like "22nd"
*/

// This is a list of nouns that use the same form for both singular and plural.
// This list should remain entirely in lower case to correctly match Strings.
var uncountableWords = [
	'equipment', 'information', 'rice', 'money', 'species', 'series',
	'fish', 'sheep', 'moose', 'deer', 'news'
];

// These rules translate from the singular form of a noun to its plural form.
var pluralRules = [
	[ new RegExp('(m)an$', 'gi'),                 '$1en' ],
	[ new RegExp('(pe)rson$', 'gi'),              '$1ople' ],
	[ new RegExp('(child)$', 'gi'),               '$1ren' ],
	[ new RegExp('^(ox)$', 'gi'),                 '$1en' ],
	[ new RegExp('(ax|test)is$', 'gi'),           '$1es' ],
	[ new RegExp('(octop|vir)us$', 'gi'),         '$1i' ],
	[ new RegExp('(alias|status)$', 'gi'),        '$1es' ],
	[ new RegExp('(bu)s$', 'gi'),                 '$1ses' ],
	[ new RegExp('(buffal|tomat|potat)o$', 'gi'), '$1oes' ],
	[ new RegExp('([ti])um$', 'gi'),              '$1a' ],
	[ new RegExp('sis$', 'gi'),                   'ses' ],
	[ new RegExp('(?:([^f])fe|([lr])f)$', 'gi'),  '$1$2ves' ],
	[ new RegExp('(hive)$', 'gi'),                '$1s' ],
	[ new RegExp('([^aeiouy]|qu)y$', 'gi'),       '$1ies' ],
	[ new RegExp('(x|ch|ss|sh)$', 'gi'),          '$1es' ],
	[ new RegExp('(matr|vert|ind)ix|ex$', 'gi'),  '$1ices' ],
	[ new RegExp('([m|l])ouse$', 'gi'),           '$1ice' ],
	[ new RegExp('(quiz)$', 'gi'),                '$1zes' ],
	[ new RegExp('s$', 'gi'),                     's' ],
	[ new RegExp('$', 'gi'),                      's' ]
];

// These rules translate from the plural form of a noun to its singular form.
var singularRules = [
	[ new RegExp('(m)en$', 'gi'),                                                       '$1an' ],
	[ new RegExp('(pe)ople$', 'gi'),                                                    '$1rson' ],
	[ new RegExp('(child)ren$', 'gi'),                                                  '$1' ],
	[ new RegExp('([ti])a$', 'gi'),                                                     '$1um' ],
	[ new RegExp('((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$','gi'), '$1$2sis' ],
	[ new RegExp('(hive)s$', 'gi'),                                                     '$1' ],
	[ new RegExp('(tive)s$', 'gi'),                                                     '$1' ],
	[ new RegExp('(curve)s$', 'gi'),                                                    '$1' ],
	[ new RegExp('([lr])ves$', 'gi'),                                                   '$1f' ],
	[ new RegExp('([^fo])ves$', 'gi'),                                                  '$1fe' ],
	[ new RegExp('([^aeiouy]|qu)ies$', 'gi'),                                           '$1y' ],
	[ new RegExp('(s)eries$', 'gi'),                                                    '$1eries' ],
	[ new RegExp('(m)ovies$', 'gi'),                                                    '$1ovie' ],
	[ new RegExp('(x|ch|ss|sh)es$', 'gi'),                                              '$1' ],
	[ new RegExp('([m|l])ice$', 'gi'),                                                  '$1ouse' ],
	[ new RegExp('(bus)es$', 'gi'),                                                     '$1'],
	[ new RegExp('(o)es$', 'gi'),                                                       '$1' ],
	[ new RegExp('(shoe)s$', 'gi'),                                                     '$1' ],
	[ new RegExp('(cris|ax|test)es$', 'gi'),                                            '$1is' ],
	[ new RegExp('(octop|vir)i$', 'gi'),                                                '$1us' ],
	[ new RegExp('(alias|status)es$', 'gi'),                                            '$1' ],
	[ new RegExp('^(ox)en', 'gi'),                                                      '$1' ],
	[ new RegExp('(vert|ind)ices$', 'gi'),                                              '$1ex' ],
	[ new RegExp('(matr)ices$', 'gi'),                                                  '$1ix' ],
	[ new RegExp('(quiz)zes$', 'gi'),                                                   '$1' ],
	[ new RegExp('s$', 'gi'),                                                           '' ]
];

// This is a list of words that should not be capitalized for title case
var nonTitlecasedWords = [
	'and', 'or', 'nor', 'a', 'an', 'the', 'so', 'but', 'to', 'of', 'at',
	'by', 'from', 'into', 'on', 'onto', 'off', 'out', 'in', 'over',
	'with', 'for'
];

// These are regular expressions used for converting between String formats
var idSuffix        = new RegExp('(_ids|_id)$', 'g');
var underbar        = new RegExp('_', 'g');
var spaceOrUnderbar = new RegExp('[\ _]', 'g');
var uppercase       = new RegExp('([A-Z])', 'g');
var underbarPrefix  = new RegExp('^_');

/**
 * This is a helper method that applies rules based replacement to a String
 *
 * Arguments:
 * 		string - String - String to modify and return based on the passed rules
 * 		rules - Array: [RegExp, String] - Regexp to match paired with String to use for replacement
 * 		skip - Array: [String] - Strings to skip if they match
 * 		override - String (optional) - String to return as though this method succeeded (used to conform to APIs)
 *
 * Returns:
 * 		String - passed String modified by passed rules
 *
 * Examples:
 * 		applyRules("cows", InflectionJs.singularRules) === 'cow'
 *
 * 2011-05-30 12.26.03 - Updated by Justin Morris
 */
applyRules = function(string, rules, skip, override) {
	if (override) {
		string = override;
	} else {
		var ignore = (skip.indexOf(string.toLowerCase()) > -1);

		if (!ignore) {
			for (var x = 0; x < rules.length; x++) {
				if (string.match(rules[x][0])) {
					string = string.replace(rules[x][0], rules[x][1]);
					break;
				}
			}
		}
	}

	return string;
}

/**
 * This function adds plurilization support to every String object
 *
 * Arguments:
 * 		plural - String (optional) - overrides normal output with said String
 *
 * Returns:
 * 		String - singular English language nouns are returned in plural form
 *
 * Examples:
 * 		"person".pluralize() == "people"
 * 		"octopus".pluralize() == "octopi"
 * 		"Hat".pluralize() == "Hats"
 * 		"person".pluralize("guys") == "guys"
 *
 * 2011-05-30 12.32.33 - Updated by Justin Morris
 */
var pluralize = exports.pluralize = function(string, plural) {
	return applyRules(
		string,
		pluralRules,
		uncountableWords,
		plural
	);
}

/**
 * This function adds singularization support to every String object
 *
 * Arguments:
 * 		singular - String (optional) - overrides normal output with said String
 *
 * Returns:
 * 		String - plural English language nouns are returned in singular form
 *
 * Examples:
 * 		"people".singularize() == "person"
 * 		"octopi".singularize() == "octopus"
 * 		"Hats".singularize() == "Hat"
 * 		"guys".singularize("person") == "person"
 *
 * 2011-05-30 12.34.39 - Updated by Justin Morris
 */
var singularize = exports.singularize = function(string, singular) {
	return applyRules(
		string,
		singularRules,
		uncountableWords,
		singular
	);
}

/**
 * This function adds camelization support to every String object
 *
 * Arguments:
 * 		lowFirstLetter - boolean (optional) - default is to capitalize the first
 * 		letter of the results... passing true will lowercase it
 *
 * Returns:
 * 		String - lower case underscored words will be returned in camel case additionally '/' is translated to '::'
 *
 * Examples:
 * 		"message_properties".camelize() == "MessageProperties"
 * 		"message_properties".camelize(true) == "messageProperties"
 *
 * 2011-05-30 12.40.23 - Updated by Justin Morris
 */
var camelize = exports.camelize = function(string, lowFirstLetter) {
	var string        = string.toLowerCase();
	var stringingPath = string.split('/');

	for (var i = 0; i < stringingPath.length; i++) {
		var stringArr = stringingPath[i].split('_');
		var initX      = ((lowFirstLetter && i + 1 === stringingPath.length) ? (1) : (0));

		for (var x = initX; x < stringArr.length; x++) {
			stringArr[x] = stringArr[x].charAt(0).toUpperCase() + stringArr[x].substring(1);
		}

		stringingPath[i] = stringArr.join('');
	}

	string = stringingPath.join('::');
	return string;
}

/**
 * This function adds underscore support to every String object
 *
 * Arguments:
 * 		N/A
 *
 * Returns:
 * 		String - camel cased words are returned as lower cased and underscored additionally '::' is translated to '/'
 *
 * Examples:
 * 		"MessageProperties".camelize() == "message_properties"
 * 		"messageProperties".underscore() == "message_properties"
 *
 * 2011-05-30 12.41.18 - Updated by Justin Morris
 */
var underscore = exports.underscore = function(string) {
	var stringingPath = string.split('::');

	for (var i = 0; i < stringingPath.length; i++) {
		stringingPath[i] = stringingPath[i].replace(uppercase, '_$1');
		stringingPath[i] = stringingPath[i].replace(underbarPrefix, '');
	}

	string = stringingPath.join('/').toLowerCase();
	return string;
}

/**
 * This function adds humanize support to every String object
 *
 * Arguments:
 * 		lowFirstLetter - boolean (optional) - default is to capitalize the first
 * 		letter of the results... passing true will lowercase it
 *
 * Returns:
 * 		String - lower case underscored words will be returned in humanized form
 *
 * Examples:
 * 		"message_properties".humanize() == "Message properties"
 * 		"message_properties".humanize(true) == "message properties"
 *
 * 2011-05-30 12.42.28 - Updated by Justin Morris
 */
var humanize = exports.humanize = function(string, lowFirstLetter) {
	var string = string.toLowerCase();
	string     = string.replace(idSuffix, '');
	string     = string.replace(underbar, ' ');

	if (!lowFirstLetter) {
		string = capitalize(string);
	}

	return string;
}

/**
 * This function adds capitalization support to every String object
 *
 * Arguments:
 * 		N/A
 *
 * Returns:
 * 		String - all characters will be lower case and the first will be upper
 *
 * Examples:
 * 		"message_properties".capitalize() == "Message_properties"
 * 		"message properties".capitalize() == "Message properties"
 *
 * 2011-05-30 12.43.49 - Updated by Justin Morris
 */
var capitalize = exports.capitalize = function(string) {
	var string = string.toLowerCase();
	string     = string.substring(0, 1).toUpperCase() + string.substring(1);

	return string;
}

/**
 * This function adds dasherization support to every String object
 *
 * Arguments:
 * 		N/A
 *
 * Returns:
 * 		String - replaces all spaces or underbars with dashes
 *
 * Examples:
 * 		"message_properties".capitalize() == "message-properties"
 * 		"Message Properties".capitalize() == "Message-Properties"
 *
 * 2011-05-30 12.44.54 - Updated by Justin Morris
 */
exports.dasherize = function(string) {
	string = string.replace(spaceOrUnderbar, '-');

	return string;
}

/**
 * This function adds titleize support to every String object
 *
 * Arguments:
 * 		N/A
 *
 * Returns:
 * 		String - capitalizes words as you would for a book title
 *
 * Examples:
 * 		"message_properties".titleize() == "Message Properties"
 * 		"message properties to keep".titleize() == "Message Properties to Keep"
 *
 * 2011-05-30 12.47.36 - Updated by Justin Morris
 */
var titleize = exports.titleize = function(string) {
	string        = string.toLowerCase();
	string        = string.replace(underbar, ' ');
	var stringArr = string.split(' ');

	for (var x = 0; x < stringArr.length; x++) {
		var d = stringArr[x].split('-');

		for (var i = 0; i < d.length; i++) {
			if (nonTitlecasedWords.indexOf(d[i].toLowerCase()) < 0) {
				d[i] = capitalize(d[i]);
			}
		}

		stringArr[x] = d.join('-');
	}

	string = stringArr.join(' ');
	string = string.substring(0, 1).toUpperCase() + string.substring(1);

	return string;
}

/**
 * This function adds demodulize support to every String object
 *
 * Signature:
 * 		String.demodulize() == String
 *
 * Arguments:
 * 		N/A
 *
 * Returns:
 * 		String - removes module names leaving only class names (Ruby style)
 *
 * Examples:
 * 		"Message::Bus::Properties".demodulize() == "Properties"
 *
 * 2011-05-30 12.49.35 - Updated by Justin Morris
 */
var demodulize = exports.demodulize = function(string) {
	var stringArr = string.split('::');
	string        = stringArr[stringArr.length - 1];

	return string;
}

/**
 * This function adds tableize support to every String object
 *
 * Signature:
 * 		String.tableize() == String
 *
 * Arguments:
 * 		N/A
 *
 * Returns:
 * 		String - renders camel cased words into their underscored plural form
 *
 * Examples:
 * 		"MessageBusProperty".tableize() == "message_bus_properties"
 *
 * 2011-05-30 12.53.05 - Updated by Justin Morris
 */
var tableize = exports.tableize = function(string) {
	string = underscore(string)
	string = pluralize(string);

	return string;
}

/**
 * This function adds classification support to every String object
 *
 * Signature:
 * 		String.classify() == String
 *
 * Arguments:
 * 		N/A
 *
 * Returns:
 * 		String - underscored plural nouns become the camel cased singular form
 *
 * Examples:
 * 		"message_bus_properties".classify() == "MessageBusProperty"
 *
 * 2011-05-30 12.54.06 - Updated by Justin Morris
 */
var classify = exports.classify = function(string) {
	string = camelize(string);
	string = singularize(string);

	return string;
}

/**
 * This function adds foreign key support to every String object
 *
 * Signature:
 * 		String.foreignKey(dropIdUbar) == String
 *
 * Arguments:
 * 		dropIdUbar - boolean (optional) - default is to seperate id with an underbar at the end of the class name, you can pass true to skip it
 *
 * Returns:
 * 		String - camel cased singular class names become underscored with id
 *
 * Examples:
 * 		"MessageBusProperty".foreignKey() == "message_bus_property_id"
 * 		"MessageBusProperty".foreignKey(true) == "message_bus_propertyid"
 *
 * 2011-05-30 13.16.10 - Updated by Justin Morris
 */
var foreignKey = exports.foreignKey = function(string, dropIdUbar) {
	string = demodulize(string);
	string = underscore(string) + ((dropIdUbar) ? ('') : ('_')) + 'id';

	return string;
}

/**
 * This function adds ordinalize support to every String object
 *
 * Signature:
 * 		String.ordinalize() == String
 *
 * Arguments:
 * 		N/A
 *
 * Returns:
 * 		String - renders all found numbers their sequence like "22nd"
 *
 * Examples:
 * 		"the 1 pitch".ordinalize() == "the 1st pitch"
 *
 * 2011-05-30 13.17.00 - Updated by Justin Morris
 */
var ordinalize = exports.ordinalize = function(string) {
	var stringArr = string.split(' ');

	for (var x = 0; x < stringArr.length; x++) {
		var i = parseInt(stringArr[x]);

		if (i === NaN) {
			var ltd = stringArr[x].substring(stringArr[x].length - 2);
			var ld  = stringArr[x].substring(stringArr[x].length - 1);
			var suf = "th";

			if (ltd != "11" && ltd != "12" && ltd != "13") {
				if (ld === "1") {
	 				suf = "st";
				} else if (ld === "2") {
	 				suf = "nd";
				} else if (ld === "3") {
					suf = "rd";
				}
			}

			stringArr[x] += suf;
		}
	}

	string = stringArr.join(' ');

	return string;
}