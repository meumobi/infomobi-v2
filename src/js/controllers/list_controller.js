'use strict';

angular
.module('infoMobi')
.controller('ListController', ListController);

function ListController($rootScope, $scope, $http, API, AppFunc, VersionService) {
	
	
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
	/*
	var config = {
		path: "infomobi/app.apk"
	};
	var androidUrl = "https://build.phonegap.com/api/v1/apps/843971/android?auth_token=dVp5pEQYSCPxXaUprtPP";
	var path = cordova.file.externalRootDirectory + config.path;
	 $rootScope.progress = "Up";
	
  $rootScope.$on(config.path + '.progress', function(e, progress) {
    if (!progress.lengthComputable) {
      $timeout(function() {
        $rootScope.progress = loadingStatus.setPercentage(progress.loaded / progress.total);
				// console.log("Downloading: " + $scope.progress);
      }, 0);
    } else {
      $timeout(function() {
				$rootScope.progress = loadingStatus.increment($rootScope.progress);
			}, 0);
    }
  });

  $rootScope.$on(config.path + '.finish', function(e, file) {
    $timeout(function() {
      window.plugins.toast.showShortBottom('Download finished');
    }, 0);
  });

  $rootScope.$on(config.path + '.error', function(e, error) {
    $timeout(function() {
      window.plugins.toast.showShortBottom('Download failed');
    }, 0);
  });

	var downloadAPK = {
		success: function(entry) {
			console.log("download complete fullpath: " + entry.toInternalURL());
			console.log("download complete toInternalURL: " + entry.toInternalURL());
			console.log("download complete toURL: " + entry.toURL());
			window.plugins.toast.showShortBottom('Download complete');
			promptForUpdateAndroid(entry);
			//$rootScope.$emit(config.path + '.finish', file);
		},
		error: function(error) {
			console.log("download error source " + error.source);
			console.log("download error target " + error.target);
			console.log("upload error code" + error.code);
			//$rootScope.$emit(config.path + 'error', error);
			window.plugins.toast.showShortBottom('Download failed');
		}
	}
	
	var loadingStatus = {
		setPercentage: function(value) {
			return Math.floor(value * 100) + "%";
		},
		increment: function(dots) {
			var index = dots.length;
			return Array(index % 4 + 2).join(".");
		}
	}

	var fileTransfer = new FileTransfer();
	$scope.prog = "Dl"

	$scope.upgradeApp = function () {
		console.log("Download Initiate path: " + path);
		fileTransfer.download(
			encodeURI(androidUrl), 
			path,
			//"cdvfile://localhost/temporary/app.apk",
			function (entry) {
				downloadAPK.success(entry);
			}, function (error) {
				downloadAPK.success(error);
			}, true);
			fileTransfer.onprogress = function(progress) {
		    if (progress.lengthComputable) {
		        $scope.prog = loadingStatus.setPercentage(progress.loaded / progress.total);
						$scope.$apply();
						console.log("Downloading: " + $scope.prog);
				}
		    //$rootScope.$emit(config.path + '.progress', progress);
		
			}
		}


	
	function promptForUpdateAndroid(entry) {
		window.plugins.webintent.startActivity({
			action: window.plugins.webintent.ACTION_VIEW,
			url: entry.toURL(),
			type: 'application/vnd.android.package-archive'
		}, function () {
		}, function () {
			alert('Failed to open URL via Android Intent.');
			console.log("Failed to open URL via Android Intent. URL: " + entry.toURL);
		});
	}
*/
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
