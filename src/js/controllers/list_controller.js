'use strict';

angular
.module('infoMobi')
.controller('ListController', ListController);

function ListController($rootScope, $scope, $http, API, UtilsService, VersionService, PushService, translateFilter) {

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


	var cb_items = {
		latest: {
			success: function(response) {
				localStorage.news = JSON.stringify(response.data.items);
				$rootScope.news = response.data.items;
				$scope.items = $rootScope.news;
				// Remove cached polls from localstorage if fetch them from server
				localStorage.removeItem("polls");
			},
			error: function(response) {
				var msg = translateFilter("items.latest.Error");
				var status = response.statusText || "Request failed";
				msg += ": " + translateFilter(status);

				UtilsService.toast(msg);
			}
		}
	}

	$scope.news = {
		sync: function() {
			API.Items.latest(cb_items.latest.success, cb_items.latest.error);
		}
	}
	
	$scope.news.sync();
}
