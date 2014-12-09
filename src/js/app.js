'use strict';

var app = angular.module('InfoBox', [
  'infoboxApp.services.Cordova',
  'ngRoute',
  'ngTouch',
  'ngAnimate',
  'ngSanitize',
  'mobile-angular-ui',
	'infoboxApp.controllers.Main',
	//'ngCachedResource',
	//'services.Analytics',
	'infoboxApp.controllers.Account',
	'infoboxApp.controllers.Login',
	'infoboxApp.controllers.List',
	'infoboxApp.controllers.Show',
	'meumobi.api',
	'meumobi.sync',
	'meumobi.app',
	'meumobi.utils'
])

app.config(function($routeProvider, $locationProvider, $httpProvider) {
  $httpProvider.interceptors.push('errorInterceptor'); 

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

.run(['$rootScope', '$location', '$window', function ($rootScope, $location, $window) {

	$rootScope.newsList = localStorage.newsList ? JSON.parse(localStorage.newsList) : [];


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
    	if($location.url().indexOf("/show")!=-1){
    		$rootScope.go('back','slideRight');		
    	}
    }, false);

}]);



