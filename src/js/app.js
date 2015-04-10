'use strict';

var app = angular

.module('InfoBox', [
	'infoboxApp.services.Cordova',
	'ngRoute',
	'ngTouch',
	'angular-carousel',
	'angular-carousel.shifty',
	'ngAnimate',
	'ngSanitize',
	'mobile-angular-ui',
	'services.Analytics',
	'meumobi.api',
	'meumobi.auth',
	'meumobi.sync',
	'meumobi.appInfo',
	'meumobi.appFunc',
	'meumobi.utils',
	'meumobi.filters',
	'meumobi.stubs',
	'meumobi.services.Files',
	'meumobi.directives.DownloadFile'
])

.config(function($routeProvider, $locationProvider, $httpProvider, analyticsProvider) {
	$httpProvider.interceptors.push('errorInterceptor');

	$routeProvider.when('/list', {
		templateUrl: "list.html",
		controller: "ListController"
	})
	.when('/show/:id', {
		templateUrl: "show.html",
		controller: "ShowController"
	})
	.when('/account', {
		templateUrl: "account.html",
		controller: "AccountController"
	})
	.when('/contact', {
		templateUrl: "contact.html",
		controller: "ContactController"
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
	.when('/login/forgot', {
		templateUrl: "forgot.html",
		controller: "ForgotController"
	})
	.when('/login/welcome', {
		templateUrl: "welcome.html",
		controller: "WelcomeController"
	})
	.otherwise({
		redirectTo: '/login'
	});

	analyticsProvider.setup('UA-59245997-1'); //TODO get id from some config file
})

.run(function($rootScope, $location, $http, analytics, AppFunc, SITE) {

	$rootScope.news = localStorage.news ? JSON.parse(localStorage.news) : [];
	//$rootScope.userToken = localStorage['userToken'] || "";
	$rootScope.site = SITE.HAL_SUPPORT ? ( localStorage['site'] ? localStorage['site'] : SITE.DOMAIN ) : SITE.DOMAIN;
	$rootScope.getImage = AppFunc.getImage;
	$rootScope.go = AppFunc.transition;
	$rootScope.history = window.history;
	$rootScope.user = localStorage.user ? JSON.parse(localStorage.user) : "";
	$http.defaults.headers.common['X-Visitor-Token'] = $rootScope.user.token;

	$rootScope.$on('loading:show', function() {
		// $rootScope.loading = true;
	})

	$rootScope.$on('loading:hide', function() {
		// $rootScope.loading = false;
	})

	// If it's the first connection redirect to welcome page
	if (localStorage.getItem("device") === null) {
		$location.path('/login/welcome');
	}

	$rootScope.$on('$routeChangeSuccess', function(e, curr, prev) {
		//send page to analytics
		analytics.trackPage($location.url().toString());
	});

	$rootScope.$on('$locationChangeStart', function (event, next, current) {
		// redirect to login page if not logged in and trying to access a restricted page
		var restrictedPage = $location.path().indexOf('login') == -1;
		var loggedIn = $rootScope.user ? $rootScope.user.token : false;
		$rootScope.NavBarBottom = restrictedPage; //loggedIn|| $location.path().indexOf('login') == -1) ? true : false;
		if (restrictedPage && !loggedIn) {
			$location.path('/login');
		}
		$rootScope.NavBarTop = ($location.path() == "/login") ? false : true;
	});

	AppFunc.startApp.executeAll();
});
