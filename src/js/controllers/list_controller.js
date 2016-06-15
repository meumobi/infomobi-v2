'use strict';

angular
.module('infoMobi')
.controller('ListController', ListController);

function ListController($rootScope, $scope, $http, API, UtilsService, VersionService, PushService) {

	var loadingStatus = {
		setPercentage: function(value) {
			return Math.floor(value * 100) + "%";
		}
	}

	$scope.progress = null;
	$rootScope.$on('version.progress', function(e, progress) {
		if (progress.lengthComputable) {
			var p = loadingStatus.setPercentage(progress.loaded / progress.total);
			$scope.$apply(function () {
				$scope.progress = p;
			});
		};
	});
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

	function success(response) {
		localStorage.news = JSON.stringify(response.data.items);
		$rootScope.news = response.data.items;
		$scope.items = $rootScope.news;
		// Remove cached polls from localstorage if fetch them from server
		localStorage.removeItem("polls");
	}

	function error(response) {
		var msg = response.statusText || "Request failed";
		if (response.status === 401) {
			delete $http.defaults.headers.common['X-Visitor-Token'];
		};
		UtilsService.toast(msg);
	}
}
