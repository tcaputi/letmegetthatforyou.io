var SERVER_API_KEY = 'AIzaSyDq_v2i5nwGJ93LrE-slZzLS2_ncE_tEB8';

var DB_URL = 'mongodb://pooter.sandile.me:27017/data';
var SCHEMA = 'data';

var request = require('request');

module.exports.bind = function (app) {
	app.get("/push/ls", function(req, res){
		var chromeInstanceId = req.param("chromeInstanceId");
		var googleId = req.session.googleId;
		var accessToken = req.session.accessToken;
		var path = req.param('path');
		console.log('gcm stuff: ' + chromeInstanceId);
		console.log('gcm stuff: ' + googleId);
		console.log('gcm stuff: ' + accessToken);
		console.log('gcm stuff: ' + path);
		
		var jsonPayload = JSON.stringify({
			channelId: chromeInstanceId,
			subchannelId: '1',
			payload: JSON.stringify({
				call: "ls",
				payload: {
					path: path
				}
			})
		});
		console.log(jsonPayload);
		request({
			url: "https://www.googleapis.com/gcm_for_chrome/v1/messages",
			body: jsonPayload,
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + accessToken
			}
		}, function (error, response, body) {
			if (error || (response.statusCode != 200 && response.statusCode != 204)) {
				console.log("GCM Failure:");
				console.log(response.statusCode);
				console.log(error);
				console.log(body);
				res.send(500, "Could not execute GCM query: " + body);
			} else {
				res.send(200);
			}
		});
	});
	
	app.get("/push/getfile", function(req, res){
		var chromeInstanceId = req.param("chromeInstanceId");
		var file = req.param("file");
		var googleId = req.session.googleId;
		var accessToken = req.session.accessToken;
		console.log('gcm stuff: ' + chromeInstanceId);
		console.log('gcm stuff: ' + googleId);
		console.log('gcm stuff: ' + accessToken);
		console.log('gcm stuff: ' + file);
		
		var jsonPayload = JSON.stringify({
			channelId: chromeInstanceId,
			subchannelId: '2',
			payload: JSON.stringify({
				call: "file",
				payload: {
					path: file
				}
			})
		});
		console.log(jsonPayload);
		request({
			url: "https://www.googleapis.com/gcm_for_chrome/v1/messages",
			body: jsonPayload,
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
				"Authorization": "Bearer " + accessToken
			}
		}, function (error, response, body) {
			if (error || (response.statusCode != 200 && response.statusCode != 204)) {
				console.log("GCM Failure:");
				console.log(response.statusCode);
				console.log(error);
				console.log(body);
				res.send(500, "Could not execute GCM query: " + body);
			} else {
				res.send(200);
			}
		});
	/*
		var message = new gcm.Message({
			collapseKey: 'getfile:' + req.param('path'),
			delayWhileIdle: false,
			timeToLive: 300,
			data: {
				command: 'getfile',
				path: req.param('path')
			}
		});
		
		var sender = new gcm.Sender(SERVER_API_KEY);
		sender.send(message, [req.param('chromeInstanceId')], 4, function (err, result) {
			console.log(result);
			if(err) res.send(err);
			else{
				res.send(200, result);
			}
		}); */
		res.send(200, "TBD");
	});
	
}

