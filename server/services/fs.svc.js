var sendgrid  = require('sendgrid')('caputit1', 'dabdabd6');

/*
req.file.file
req.body.emailto
req.body.method
*/
module.exports.bind = function (app) {
	app.post("/file/magic", function(req, res){
		fs.readFile(req.files.file.path, function (err, data) {
			if(req.body.method == 'email'){
				var Email = sendgrid.Email;
				var email = new Email({
					to: req.body.emailto,
					from: 'roy@sample.com', //TODO
					subject: 'File sent: ' + req.body.filename,
					text: 'I got that for you.'
				});
				email.addFile({
					path: req.files.file.path
				});
				email.send();
			}else{
				//send to client for direct download
			}
			res.redirect("back");
		});
	});
}