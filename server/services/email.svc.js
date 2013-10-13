var sendgrid  = require('sendgrid')('caputit1', 'dabdabd6');

module.exports.bind = function (app) {
	app.post("/email/send", function(req, res){
		var Email = sendgrid.Email;
		var email = new Email({
			to: req.body.googleId + '@gmail.com',
			from: 'roy@sample.com', //TODO
			subject: 'File sent: ' + req.body.filename,
			text: 'I got that for you.'
		});
		
		email.addFile({
			path: req.body.filepath
		});

		email.send();
	});
}