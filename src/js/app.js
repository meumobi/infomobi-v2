'use strict';

var app = angular.module('InfoBox', [
  'infoboxApp.services.Cordova',
  'ngRoute',
  'ngTouch',
  'angular-carousel',
  'angular-carousel.shifty',
  'ngAnimate',
  'ngSanitize',
  'mobile-angular-ui',
	'infoboxApp.controllers.Main',
	//'ngCachedResource',
	'services.Analytics',
	'infoboxApp.controllers.Account',
	'infoboxApp.controllers.Contact',
	'infoboxApp.controllers.Login',
	'infoboxApp.controllers.List',
	'infoboxApp.controllers.Show',
  'infoboxApp.controllers.Files',
  'infoboxApp.controllers.Forgot',
	'meumobi.api',
	'meumobi.sync',
	'meumobi.appInfo',
	'meumobi.appFunc',
	'meumobi.utils',
	'meumobi.filters',
	'meumobi.services.Files',
	'meumobi.directives.DownloadFile',
])

app.config(function($routeProvider, $locationProvider, $httpProvider, analyticsProvider) {
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
    .when('/files', {
        templateUrl: "files.html",
        controller: "FilesController"
    })
	.when('/forgot', {
        templateUrl: "forgot.html",
        controller: "ForgotCtrl"
    })
	.otherwise({redirectTo: '/login'});

  analyticsProvider.setup('UA-59245997-1');//TODO get id from some config file
})

.run(function ($rootScope, $location, analytics, AppFunc, API) {

	$rootScope.newsList = localStorage.newsList ? JSON.parse(localStorage.newsList) : [];
	$rootScope.userToken = localStorage['userToken'] || "";

    $rootScope.go = AppFunc.transition;

    $rootScope.$on('$routeChangeSuccess', function(e, curr, prev) {
      //send page to analytics
      analytics.trackPage($location.url().toString());
      
	    if(location.href.indexOf('login')==-1 && location.href.indexOf('forgot')==-1){
	    	if(!$rootScope.userToken || $rootScope.userToken!=localStorage.userToken){
	    		delete localStorage.userToken
	    		$rootScope.go('/login');
	    	}
    	}
    });

    
    AppFunc.startApp.executeAll();

});
