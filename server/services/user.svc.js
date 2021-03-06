var MongoClient = require('mongodb').MongoClient;

var DB_URL = 'mongodb://pooter.sandile.me:27017/data';
var SCHEMA = 'data';

module.exports.bind = function (app) {
	app.post("/user/new", function(req, res){
		MongoClient.connect(DB_URL, function(err, db) {
			if(err) throw err;
			var collection = db.collection(SCHEMA);
			collection.save({googleId : req.body.googleId, accessToken : null, devices : []}, function(err, docs) {
				if(err) throw err;
				console.log(docs);
				res.send(200, JSON.stringify(docs));
				db.close();
			});
		})
	});
	
	//debuging only
	app.delete("/user/deleteAll", function(req, res){
		MongoClient.connect(DB_URL, function(err, db) {
			if(err) throw err;
			var collection = db.collection(SCHEMA);
			collection.remove(function(err, docs) {
				if(err) throw err;
				console.log(docs);
				res.send(200, JSON.stringify(docs));
				db.close();
			});
		});
	});
}