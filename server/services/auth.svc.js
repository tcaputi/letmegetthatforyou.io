var MongoClient = require('mongodb').MongoClient;
var qs = require('querystring');
var request = require('request');
var md5 = require('MD5');

//TODO: FIX FOR GOOGLE
var CLIENT_ID = '1073639428455-4i31qgcbhon7dvstd9r6efeo7rhcsedl.apps.googleusercontent.com';
var APP_SECRET = 'TdJQNp1INvQHdCINUiQbR6PZ';
var GOOGLE_OAUTH_AUTH_URL = 'https://accounts.google.com/o/oauth2/auth';
var GOOGLE_OAUTH_TOKEN_URL = 'https://accounts.google.com/o/oauth2/token';
var GOOGLE_OAUTH_PROFILE_URL = 'https://www.googleapis.com/oauth2/v1/userinfo';
var SERVER_URL = 'pooter.sandile.me:7373';

var DB_URL = 'mongodb://pooter.sandile.me:27017/data';
var SCHEMA = 'data';

module.exports.bind = function (app) {
	app.get('/google/auth', function (req, res) {
        var userId = md5((new Date()).getTime() + Math.floor((Math.random()*1000)+1) + 'mamacakes');
      
		req.session.userId = userId;
		var queryString = qs.stringify({
			response_type: 'code',
			client_id: CLIENT_ID,
			scope: 'https://www.googleapis.com/auth/userinfo.email',
			state: md5((new Date()).getTime() + Math.floor((Math.random()*100)+1) + 'thing'),
			redirect_uri: 'http://' + SERVER_URL + '/google/redir'
		});
		res.redirect(GOOGLE_OAUTH_AUTH_URL + '?' + queryString);
    });
	
    app.get('/google/redir', function (req, res) {
        var code = req.param('code');
        var userId = req.session.userId;
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
                form: {
                    client_id: CLIENT_ID,
                    client_secret: APP_SECRET,
                    grant_type: 'authorization_code',
					redirect_uri: 'http://' + SERVER_URL + '/google/redir',
                    code: code
                },
				method: 'POST'
            }, function (error, response, body) {
                if (error || response.statusCode == 500) {
                    console.log('[ERROR] google auth: ' + error);
                    res.json(500, error);
                } else {
                    // Successfully got the token, lets boogie
					var payload = JSON.parse(body);
					request({
						url: GOOGLE_OAUTH_PROFILE_URL,
						headers: {
							"Content-Type" : "application/json",
							"Authorization" : "OAuth " + payload.access_token
						}}, function(error, response, body){
						
						MongoClient.connect(DB_URL, function(err, db) {
							if(err) throw err;
							var collection = db.collection(SCHEMA);
							collection.findOne({googleId : body.email.replace("@gmail.com", "")}, function(err, docs) {
								if(err) throw err;
								if(docs){
									docs.access_token = payload.access_token;
									collection.save(docs, function(err, updatedDoc) {
										if(err) throw err;
										console.log(updatedDoc);
										res.send(200, updatedDoc);
										db.close();
									});
								}else{
									var newUser = {googleId : body.email.replace("@gmail.com", ""), accessToken : payload.access_token, devices : []}; 
									collection.save(newUser, function(err, docs) {
										if(err) throw err;
										console.log(docs);
										res.send(200, newUser);
										db.close();
									});
								}
							});
						});
					});
                }
            });
        }
    });
}