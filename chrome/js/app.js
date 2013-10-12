// Configure the require lib with all our other libs
require.config({
	baseUrl: "js/lib",
	paths: {
		jquery: "jquery-2.0.3.min", // jQuery
		googleApi: "gapi-client.min", // Google API JS Client
	}
});

// Start the main app logic.
require(["./js/dal/dal.js", "./js/ui/ui.js"], function (dal, ui) {
    // Initialize modules
    dal.init();
    ui.init();
});