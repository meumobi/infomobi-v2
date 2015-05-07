'use strict';

angular
.module('infoMobi')
.controller('ShowController', ShowController);

function ShowController($rootScope, $scope, $sce, $routeParams, API, APP, AppFunc) {
	$scope.getTrustedResourceUrl = function(src) {
		return $sce.trustAsResourceUrl(src);
	}

	$scope.loadURL = function(url) {
		//target: The target in which to load the URL, an optional parameter that defaults to _self. (String)
		//_self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.
		//_blank: Opens in the InAppBrowser.
		//_system: Opens in the system's web browser.
		window.open(url, '_blank');
	}

	function findMediasByType(medias, types) {
		var results = [];
		for (var i = 0; i < medias.length; i++) {
	    if (types.indexOf(medias[i].type) > -1) {
	      results.push(medias[i]);
	    }
	  }
	  return results;
	}

	$scope.hasAudio = function(item) {
		return (findMediasByType(item.medias, ["audio/mpeg", "audio/mp3"]).length > 0)
	}
	
	$scope.hasVideo = function(item) {
		return (findMediasByType(item.medias, ["video/mpeg", "video/mp4"]).length > 0)
	}

	$scope.shareFeed = function() {
		AppFunc.shareFeed($scope.item);
	};	

	$scope.item = $rootScope.news[$routeParams.id];
	$scope.item.next = ($routeParams.id < $rootScope.news.length) ? '/show/' + (parseInt($routeParams.id) + 1) : "";
	$scope.item.previous = ($routeParams.id > 0) ? '/show/' + (parseInt($routeParams.id) - 1) : "";
}
