'use strict';

var app = angular.module('InfoBox', [
  'ngRoute',
  'ngTouch',
  'ngAnimate',
  'ngSanitize',
  'mobile-angular-ui',
	'infoboxApp.controllers.Main',
	'meumobi.settings',
	'meumobi.api',
	//'ngCachedResource',
	//'services.Analytics',
	'infoboxApp.controllers.Account',
	'infoboxApp.controllers.Login',
	'infoboxApp.controllers.List',
	'infoboxApp.controllers.Show'
])

app.config(function($routeProvider, $locationProvider) {

	$routeProvider.when('/list', {
		templateUrl: "list.html",
		controller: "ListController"
	})
	.when('/show/:id',	{
		templateUrl: "show.html",
		controller: "ShowController"
	})
	.when('/account', {
		templateUrl: "account.html",
		controller: "AccountCtrl"
	})
	.when('/login', {
		templateUrl: "login.html",
		controller: "LoginController"
	})
	.when('/about', {
		templateUrl: "about.html"
	})
	.otherwise({redirectTo: '/login'});
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



