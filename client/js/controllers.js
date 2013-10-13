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
      if (!sharedService.logged_in){
        console.log('not authorized');
        $location.path('/login');
      }
    }

    sharedService.authorize = function(options){
      $location.path(options.path);
    }

    sharedService.device = function(){
      prototype.getFiles = function(id){

      }
    }

    sharedService.file = function(){
      prototype.email(){

      }
    }

    return sharedService;
});

lmgtfyModule.config(
  ['$routeProvider', 
    function($routeProvider) {
      $routeProvider.
        when('/', {templateUrl:'templates/device.html',   controller: devices}).
        when('/index', {templateUrl:'templates/device.html',   controller: devices}).
        when('/devices', {templateUrl: 'templates/device.html',   controller: devices}).
        when('/files', {templateUrl: 'templates/file.html',   controller: files}).
        when('/login', {templateUrl: 'templates/home.html',   controller: home})
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
  lmgtfySharedService.protect();
  $scope.devices = [{},{},{}];

  $scope.chooseDevice = function(){
    console.log('device chosen');
    $location.path('files');
  }
}

function files($scope, $location, lmgtfySharedService){
  lmgtfySharedService.protect();
  $scope.files = [{},{},{},{},{}];

  $scope.email(){

  }

  $scope.download(){
    
  }
}
