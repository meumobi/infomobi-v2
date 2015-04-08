'use strict';

angular
.module('InfoBox')
.controller('ListController', ListController);

function ListController($rootScope, $scope, $http, API, AppFunc) {

	$scope.items = $rootScope.news;
	API.Items.latest(success, error);
	
	$rootScope.$on('loading:show', function() {
		$scope.loadingItems = true;
	})

	$rootScope.$on('loading:hide', function() {
		$scope.loadingItems = false;
	})

	$scope.syncNews = function () {
		API.Items.latest(success, error);
	}

	function success(data, status) {
		localStorage.news = JSON.stringify(data.items);
		$rootScope.news = data.items;
		$scope.items = $rootScope.news;
		AppFunc.eraseNotifications();
	}

	function error(data, status) {
		$scope.data = data || "Request failed";
		$scope.status = status;
		AppFunc.toast(data.error);
	}
}
