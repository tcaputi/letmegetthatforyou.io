console.log('intiated');

var lmgtfyModule = angular.module('lmgtfyModule', []);

lmgtfyModule.factory('lmgtfySharedService', function($rootScope, $http, $location){
    var sharedService = {};

    //final variables
    sharedService.session_data = {};
    sharedService.api_url = "http://pootersandile.me:7373/";

    //variables
    sharedService.search_query = "";
    sharedService.logged_in = false;

    SharedService.account = new account();

    sharedService.protect = function(){
      if (!sharedService.logged_in){
        console.log('not authorized');
        $location.path('/login');
      }
    }

    sharedService.authorize = function(options){
      $location.path(options.path);
    }

    //account class
    sharedService.account = function(){

      this.authenticate();

      data = [];

      prototype.getSessionData = function(){
        $http({
          url: SharedService.api_url+'user/show/username/'+$scope.userid, 
          method: "GET",
        })
        .success(function(data, status) {
          console.log(data);
          this.data = data;
          sharedService.logged_in = true;
        })
        .error(function(data, status) {
          $location.path('/');
        });
      }

      prototype.authenticate = function(){

        //google/auth
        $http({
          url: SharedService.api_url+'google/auth', 
          method: "GET",
        })
        .success(function(data, status) {
          console.log(data);
          console.log('user logged in');
          this.data = data;
          sharedService.logged_in = true;
        })
        .error(function(data, status) {
          console.log('did not log in');
          $location.path('/');
        });
      } 
    }

    //device
    sharedService.device = function(){

      //push/ls
      prototype.getFiles = function(id){
        $http({
          url: SharedService.api_url+'push/ls/path'+$scope.userid + '/ChromeInstanceId/'+sharedService.account.data.devices.chromeInstanceId, 
          method: "GET",
        })
        .success(function(data, status) {
          console.log($scope.user);
        })
        .error(function(data, status) {
          $location.path('/');
        });
      }
    }

    //file
    sharedService.file = function(){

      var data;

      prototype.email = function(){
        //
        $http({
          url: SharedService.api_url+'email/send', 
          method: "POST",
          data: {'googleId':SharedService.account.data.googleId}
        })
        .success(function(data, status) {
          console.log($scope.user);
        })
        .error(function(data, status) {
          $location.path('/');
        });
      }

      prototype.download = function(){
        //data

        $http({
          url: pnSharedService.api_url+'user/show/username/'+$scope.userid, 
          method: "GET",
        })
        .success(function(data, status) {
          console.log($scope.user);
        })
        .error(function(data, status) {
          $location.path('/');
        });
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
        when('/devices/:id/files', {templateUrl: 'templates/file.html',   controller: files}).
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

  $scope.chooseDevice = function(id){
    $location.path('devices/'+id+'/files/');
    console.log('devices/'+id+'/files/');
  }
}

function files($scope, $location, lmgtfySharedService){
  lmgtfySharedService.protect();
  $scope.files = [{},{},{},{},{}];

  $scope.email = function(id){
    $scope.files[id].email();
  }

  $scope.download = function(id){
    $scope.files[id].download();
  }
}
