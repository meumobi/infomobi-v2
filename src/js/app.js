'use strict';

var app = angular.module('InfoBox', [
  'ngRoute',
  'ngTouch',
  'mobile-angular-ui',
	'infoboxApp.controllers.Main',
	'infoboxApp.services.Analytics',
	'infoboxApp.controllers.Account'
])

app.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/',          {templateUrl: "list.html"});
	$routeProvider.when('/list',		{templateUrl: "list.html"});
	$routeProvider.when('/show',		{templateUrl: "show.html"});
	$routeProvider.when('/account', {
		templateUrl: "account.html",
		controller: "AccountCtrl"
	});
	$routeProvider.when('/about', {templateUrl: "about.html"});
	$routeProvider.otherwise({redirectTo: '/'});
});