console.log('intiated');

var lmgtfyModule = angular.module('lmgtfyModule', []);

lmgtfyModule.factory('lmgtfySharedService', function($rootScope, $http, $location){
    var sharedService = {};

    //final variables
    sharedService.session_data = {};
    sharedService.api_url = "";

    //variables
    sharedService.search_query = "";
    sharedService.logged_in = true;

    /*$http({
        url: sharedService.api_url+"account/session_data", 
        method: "GET",
      })
      .success(function(data, status) {
          sharedService.logged_in = true;
          sharedService.session_data = data.status;
          console.log(data);
      })
      .error(function(data, status) {
          sharedService.logged_in = false;
          console.log(data);
      });

      console.log('intiated');*/

    sharedService.protect = function(){
      if (sharedService.logged_in){
        $location.path('/');
      }
    }

    sharedService.authorize = function(options){
      $location.path(options.path);
    }

    return sharedService;
});

lmgtfyModule.config(
  ['$routeProvider', 
    function($routeProvider) {
      $routeProvider.
        when('/', {templateUrl:'templates/home.html',   controller: home}).
        when('/index', {templateUrl:'templates/home.html',   controller: home}).
        when('/devices', {templateUrl: 'templates/device.html',   controller: devices}).
        when('/files', {templateUrl: 'templates/file.html',   controller: files})
    }
  ]
);

lmgtfyModule.config(
    ['$locationProvider',
      function($locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
      }
    ]
  );

function home($scope, $location, lmgtfySharedService){



  $scope.login = function(){
    console.log('test');
    lmgtfySharedService.authorize({path:'devices'});
  };
}

function devices($scope, $location, lmgtfySharedService){



  $scope.devices = [{},{},{}];


}

function files(){

}
