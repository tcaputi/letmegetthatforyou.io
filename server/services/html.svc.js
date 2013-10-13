module.exports.bind = function (app) {
	app.post("/", function(req, res){
		res.render('/index.html');
	});
	app.post("/devices", function(req, res){
		res.render('/index.html');
	});
	app.post("/devices/:id/files", function(req, res){
		res.render('/index.html');
	});
	app.post("/login", function(req, res){
		res.render('/index.html');
	});
}