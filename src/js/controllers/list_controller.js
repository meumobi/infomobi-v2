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
		if ($rootScope.versionServiceIsEnabled) {
			VersionService.getLatestAppSignature();
		}
	}
		
	$scope.syncNews();

	function success(data, status) {
		localStorage.news = JSON.stringify(data.items);
		$rootScope.news = data.items;
		$scope.items = $rootScope.news;
		// Remove cached polls from localstorage if fetch them from server
		localStorage.removeItem("polls");
	}

	function error(data, status) {
		var msg = data.error || "Request failed";
		if (status === 401) {
			delete $http.defaults.headers.common['X-Visitor-Token'];
		};
		UtilsService.toast(msg);
	}
}
