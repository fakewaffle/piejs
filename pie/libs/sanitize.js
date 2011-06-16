/**
 * Removes any none alphanumeric, hyphen (-), and underscore (_) for use
 * within dispatcher.
 *
 * Controllers names and their actions/methods should only have alphanumeric,
 * hyphens, and underscores in them.
 *
 * @param string string String to clean
 * @return string
 *
 * @author Justin Morris
 * @created 2011-05-12 21.16.55
 */
exports.dispatcher = function(string) {
	if (typeof string !== 'undefined' && string) {
		return string.replace(/[^A-Za-z0-9._-]/g, '');
	}
}

/**
 * Removes any none alphanumeric and white space characters
 *
 * @param string string String to clean
 * @return string
 *
 * @author Justin Morris
 * @created 2011-05-12 21.19.52
 */
exports.paranoid = function(string) {
	if (typeof string !== 'undefined' && string) {
		return string.replace(/[^A-Za-z0-9\s]/g, '');
	}
}