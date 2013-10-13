var gcm = require('node-gcm');

var SERVER_API_KEY = ''; //TODO

module.exports.bind = function (app) {
	app.get("/push/ls", function(req, res){
		var message = new gcm.Message({
			collapseKey: 'ls:' + req.param('path'),
			delayWhileIdle: false,
			timeToLive: 300,
			data: {
				command: 'ls',
				path: req.param('path');
			}
		});
		
		var sender = new gcm.Sender(SERVER_API_KEY);
		sender.send(message, [req.param('chromeInstanceId');], 4, function (err, result) {
			console.log(result);
			if(err) res.send(err);
			else{
				res.send(200, result);
			}
		});
	});
	
	app.get("/push/getfile", function(req, res){
		var message = new gcm.Message({
			collapseKey: 'getfile:' + req.param('path'),
			delayWhileIdle: false,
			timeToLive: 300,
			data: {
				command: 'getfile',
				path: req.param('path');
			}
		});
		
		var sender = new gcm.Sender(SERVER_API_KEY);
		sender.send(message, [req.param('chromeInstanceId');], 4, function (err, result) {
			console.log(result);
			if(err) res.send(err);
			else{
				res.send(200, result);
			}
		});
	});
	
}

