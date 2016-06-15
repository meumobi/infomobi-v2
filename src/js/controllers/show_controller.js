'use strict';

angular
.module('infoMobi')
.controller('ShowController', ShowController);

function ShowController($rootScope, $scope, $filter, $sce, $routeParams, APP, UtilsService, $log) {
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

	function findMediasByTypes(medias, types) {
		var results = [];
		for (var i = 0; i < medias.length; i++) {
			if (types.indexOf(medias[i].type) > -1) {
				results.push(medias[i]);
			}
		}
		return results;
	}

	$scope.shareItem = function() {
		$log.debug("Share Item");
		$log.debug($scope.item);
		UtilsService.shareItem($scope.item);
	};

	$scope.item = $rootScope.news[$routeParams.id];
	/*
	if RSS use enclosure to illustrate article with images, these images are converted on meumobi as image and media. Then we skip here media those type is image/jpeg to prevent download AND display on carousel.
	Images should be displayed on top of articles and enlarge (fullscreen) by click.
	No need to download them, they are cached for offline use.
	*/
	$scope.media = $filter('filter')($scope.item.medias, {type: "!image/jpeg"});

	$scope.item.next = ($routeParams.id < $rootScope.news.length-1) ? '/show/' + (parseInt($routeParams.id) + 1) : "#";
	$scope.item.previous = ($routeParams.id > 0) ? '/show/' + (parseInt($routeParams.id) - 1) : "#";
	
	$scope.audio = {};
	$scope.video = {};
	
	hasAudio($scope.item);
	hasVideo($scope.item);

	function hasAudio(item) {
		var medias = findMediasByTypes(item.medias, ["audio/mpeg", "audio/mp3"])
		if (medias.length > 0) {
			$scope.audio = medias[0];
		}
		return ($scope.audio.length > 0)
	}
	
	function hasVideo(item) {
		var medias = findMediasByTypes(item.medias, ["video/mpeg", "video/mp4"])
		if (medias.length > 0) {
			$scope.video = medias[0];
		}
		return ($scope.video.length > 0)
	}
}
