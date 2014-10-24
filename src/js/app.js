'use strict';

var app = angular.module('InfoBox', [
  'ngRoute',
  'ngTouch',
  'mobile-angular-ui',
	'InfoBox.controllers.Main',
	'InfoBox.services.Analytics',
	'InfoBox.controllers.Account'
])

app.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/',          {templateUrl: "list.html"});
	$routeProvider.when('/list',		{templateUrl: "list.html"});
	$routeProvider.when('/show',		{templateUrl: "show.html"});
	$routeProvider.when('/account',		{templateUrl: "account.html"});
	$routeProvider.when('/about',		{
		templateUrl: "about.html",
		controller: "AccountCtrl"
	});
	$routeProvider.otherwise({redirectTo: '/'});
});