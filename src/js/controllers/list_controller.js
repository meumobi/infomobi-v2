'use strict';

angular
.module('infoMobi')
.controller('ListController', ListController);

function ListController($rootScope, $scope, $http, API, AppFunc) {

	$scope.items = $rootScope.news;
	
	$rootScope.$on('loading:show', function() {
		$scope.loadingItems = true;
	})

	$rootScope.$on('loading:hide', function() {
		$scope.loadingItems = false;
	})

	$scope.syncNews = function () {
		API.Items.latest(success, error);
	}
	
	$scope.syncNews();

	function success(data, status) {
		localStorage.news = JSON.stringify(data.items);
		$rootScope.news = data.items;
		$scope.items = $rootScope.news;
		AppFunc.eraseNotifications();
	}

	function error(data, status) {
		var msg = data.error || "Request failed";
		if (status === 401) {
			delete $http.defaults.headers.common['X-Visitor-Token'];			
		};
		AppFunc.toast(msg);
	}
}
