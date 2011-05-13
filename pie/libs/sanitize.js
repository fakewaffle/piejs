exports.dispatcher = function(string) {
	if (typeof string != 'undefined' && string) {
		return string.replace(/[^A-Za-z0-9_-]/g, '');
	}
}

exports.paranoid = function(string) {
	if (typeof string != 'undefined' && string) {
		return string.replace(/[^A-Za-z0-9]/g, '');
	}
}