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
	'infoboxApp.controllers.Contact',
	'infoboxApp.controllers.Login',
	'infoboxApp.controllers.List',
	'infoboxApp.controllers.Show',
	'meumobi.api',
	'meumobi.sync',
	'meumobi.appInfo',
	'meumobi.appFunc',
	'meumobi.utils',
	'meumobi.filters'
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
	.when('/contact', {
		templateUrl: "contact.html",
		controller: "ContactCtrl"
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

.run(['$rootScope', '$location', 'AppFunc', 'API', function ($rootScope, $location, AppFunc, API) {

	$rootScope.newsList = localStorage.newsList ? JSON.parse(localStorage.newsList) : [];
	$rootScope.userToken = localStorage['userToken'] || "";

    $rootScope.go = AppFunc.transition;

    $rootScope.$on('$routeChangeSuccess', function(e, curr, prev) {
    	if(location.href.indexOf('login')==-1){
	    	if(!$rootScope.userToken || $rootScope.userToken!=localStorage.userToken){
	    		delete localStorage.userToken
	    		$rootScope.go('/login');
	    	}
    	}
    });

    
    AppFunc.startApp.executeAll();

}]);