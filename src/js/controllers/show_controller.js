'use strict';

angular
	.module('InfoBox')
	.controller('ShowController', ShowController);

	function ShowController($rootScope, $scope, $sce, $routeParams, API, SITE) {
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

		$scope.shareFeed = function() {

			var subject = $scope.item.title;
			var message = $scope.item.description;
			message = message.replace(/(<([^>]+)>)/ig, "");

			var link = $scope.item.link;

			//Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
			//window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
			window.plugins.socialsharing.share(message, subject, null, link);
		}

		$scope.item = $rootScope.news[$routeParams.id];
		$scope.item.next = ($routeParams.id < $rootScope.news.length) ? '/show/' + (parseInt($routeParams.id) + 1) : "";
		$scope.item.previous = ($routeParams.id > 0) ? '/show/' + (parseInt($routeParams.id) - 1) : "";
	}
