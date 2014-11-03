'use strict';

var app = angular.module('InfoBox', [
  'ngRoute',
  'ngTouch',
  'ngAnimate',
  'ngSanitize',
  'mobile-angular-ui',
	'infoboxApp.controllers.Main',
	'infoboxApp.services.Analytics',
	'infoboxApp.controllers.Account',
	'infoboxApp.controllers.Login',
	'infoboxApp.controllers.List',
	'infoboxApp.controllers.Show'
])

app.config(function($routeProvider, $locationProvider) {
	//$routeProvider.when('/',          {templateUrl: "login.html"});
	$routeProvider.when('/list', {
		templateUrl: "list.html",
		controller: "ListController"
	});
	$routeProvider.when('/show/:index',	{
		templateUrl: "show.html",
		controller: "ShowController"
	});
	$routeProvider.when('/account', {
		templateUrl: "account.html",
		controller: "AccountCtrl"
	});
	$routeProvider.when('/login', {
		templateUrl: "login.html",
		controller: "LoginController"
	});
	$routeProvider.when('/about', {templateUrl: "about.html"});
	$routeProvider.otherwise({redirectTo: '/login'});
})

.run(['$rootScope', '$location', '$window', function ($rootScope, $location, $window, $routeParams) {

    $rootScope.go = function (path, pageAnimationClass) {

        if (typeof(pageAnimationClass) === undefined) { // Use a default, your choice
            $rootScope.pageAnimationClass = 'crossFade';
        }else { // Use the specified animation
            $rootScope.pageAnimationClass = pageAnimationClass;
        }

        if (path === 'back') { // Allow a 'back' keyword to go to previous page
            $window.history.back();
        }else { // Go to the specified path
            $location.path(path);
        }

    };

    document.addEventListener("backbutton", function(){
      $rootScope.go('back','slideRight');
    }, false);


}]);



