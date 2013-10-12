var fs = require('fs');
var files = fs.readdirSync('./services/');

module.exports.bind = function (app) {
	for(var i in files) {
		if(files[i] != 'index.js') {
			var svc = require('./' + files[i].replace('.js', ''));
			if (svc.bind) svc.bind(app);
		}
	}
}