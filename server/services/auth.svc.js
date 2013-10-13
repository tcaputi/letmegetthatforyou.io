var MongoClient = require('mongodb').MongoClient;
var qs = require('querystring');
var request = require('request');
var md5 = require('MD5');

//TODO: FIX FOR GOOGLE
var CLIENT_ID = '1073639428455.apps.googleusercontent.com';
var APP_SECRET = '3Vdw2hGjC7XXDWpvPEArpd_G';
var GOOGLE_OAUTH_AUTH_URL = 'https://accounts.google.com/o/oauth2/auth';
var GOOGLE_OAUTH_TOKEN_URL = 'https://www.googleapis.com/oauth2/v1/tokeninfo';
var SERVER_URL = 'pooter.sandile.me:7373';

var DB_URL = 'mongodb://pooter.sandile.me:27017/data';
var SCHEMA = 'data';

module.exports.bind = function (app) {
	app.get('/google/auth/:userId', function (req, res) {
        var userId = req.param('userId');
        if (!userId) {
            res.json(500, {
                name: 'MissingParameterException',
                description: 'userId was null'
            });
        } else {
		
			MongoClient.connect(DB_URL, function(err, db) {
				if(err) res.json(500, err);
				var collection = db.collection(SCHEMA);
				collection.findOne({googleId : userId}, function(err, docs) {
					if(err) res.json(500, err);
					else if(!docs) res.json(500, docs);
					else{
						//TODO: FIX FOR GOOGLE
						var queryString = qs.stringify({
							response_type: 'code',
							client_id: CLIENT_ID,
							scope: 'openid, email', //TODO:
							state: md5((new Date()).now() + Math.floor((Math.random()*100)+1) + 'thing'),
							redirect_uri: 'http://' + SERVER_URL + ':' + app.get('port') + '/google/redir/' + userId
						});
						console.log('qs: ' + queryString);
						res.redirect(GOOGLE_OAUTH_AUTH_URL + '/?' + queryString);
						db.close();
					}
				});
			})
        }
    });
	
    app.get('/google/redir/:userId', function (req, res) {
        var code = req.param('code');
        var userId = req.param('userId');
        if (!code) {
            console.log('[ERROR] the code parameter from google/redir was null....');
            res.send(500, "[ERROR] the code parameter from google/redir was null....");
            return;
        } else if (!userId) {
            console.log('[ERROR] the userId parameter from google/redir was null....');
            res.send(500, '[ERROR] the userId parameter from google/redir was null....');
            return;
        } else {
            // Go ahead with REST logic
            request({
                url: GOOGLE_OAUTH_TOKEN_URL,
                qs: {
                    client_id: CLIENT_ID,
                    client_secret: APP_SECRET,
                    grant_type: 'authorization_code',
					redirect_uri: 'http://' + SERVER_URL + ':' + app.get('port') + '/google/redir/' + userId
                    code: code
                }
            }, function (error, response, body) {
                if (error || response.statusCode == 500) {
                    console.log('[ERROR] google auth: ' + error);
                    res.json(500, error);
                } else {
                    // Successfully got the token, lets boogie
					var payload = JSON.parse(body);
					
					MongoClient.connect(DB_URL, function(err, db) {
						if(err) throw err;
						var collection = db.collection(SCHEMA);
						collection.update({googleId : req.body.googleId}, {$set: {accessToken: payload.access_token}}, function(err, docs) {
							if(err) throw err;
							console.log(docs);
							res.send(200, JSON.stringify(docs));
							db.close();
							
							console.log('worked ' + payload.access_token);
							res.redirect('http://www.google.com');
						});
					})
                }
            });
        }
    });
}