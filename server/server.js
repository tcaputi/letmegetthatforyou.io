// Library Imports
var express = require("express");
var app = express();

//Middleware
app.use(express.bodyParser());

require("./services/").bind(app);

// Constants
var SERVER_PORT = 7373;

// Start app
app.listen(SERVER_PORT, function() {
	console.log("Server started on port " + SERVER_PORT);
});