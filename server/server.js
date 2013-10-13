// Library Imports
var express = require("express");
var app = express();

//Middleware
app.use(express.cookieParser());
var MemStore = express.session.MemoryStore;
app.use(express.session({secret: 'secret_key', store: MemStore({
  reapInterval: 60000 * 10
})}));
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

require("./services/").bind(app);

// Constants
var SERVER_PORT = 7373;

// Start app
app.listen(SERVER_PORT, function() {
	console.log("Server started on port " + SERVER_PORT);
});