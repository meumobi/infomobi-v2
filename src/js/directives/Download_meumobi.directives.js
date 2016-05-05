(function() {
	'use strict';
	
	angular
	.module('meumobi.directives.DownloadFile', [])
	.directive('downloadFileControls', downloadFileControls);

	function downloadFileControls($rootScope, translateFilter, files, $timeout, MEDIAS, UtilsService, $log) {
		var directive = {
			restrict: 'E',
			scope: {
				file: '='
			},
			template: "<ng-include src=\"'utils/' + file.status + '_file_controls.html'\" />",
			link: link
		};
		return directive;
		
		function link(scope, element, attrs) {
			//use a simple link if not on app or file not allowed for download

			scope.openInAppBrowser = UtilsService.openInAppBrowser;
			/*
			TODO: isCordovaApp should be a param of directive, to not re-compute at each iteration
			*/
			/*
			media controls are displayed if isApp and file type is known
			https://jsfiddle.net/vrjw7L1k/1/
			*/
			var isDownloadFile = (scope.file.type in MEDIAS) && MEDIAS[scope.file.type].download;

			
			if (UtilsService.isCordovaApp() && isDownloadFile) {
				//load file status and localstorage data
				scope.file = files.get(scope.file);
				/*
				* register for download progress events
				*/
				var fileName = files.fileName(scope.file);
				scope.progress = 0;
				$rootScope.$on(fileName + '.progress', function(e, progress) {
					if (progress.lengthComputable) {
						$timeout(function() {
							scope.progress =  Math.floor(progress.loaded / progress.total * 100);
						}, 0);
					}
				});

				$rootScope.$on(fileName + '.finish', function(e,file) {
					$timeout(function() {
						angular.extend(scope.file, file);
						UtilsService.toast(translateFilter('Download finished'));
					}, 0);
				});

				$rootScope.$on(fileName + '.error', function(e,error) {
					$timeout(function() {
						//reset file status
						scope.file.status = files.statuses.download;
						UtilsService.toast(translateFilter('Download failed'));
					}, 0);
				});

				/**
				*  The manage file available methods
				*/
				scope.downloadFile = function (file) {
					files.download(file);
				}

				scope.shareMedia = function(media) {
					UtilsService.shareMedia(media);
				};

				scope.openMedia = function(media) {
					UtilsService.openMedia(media);
				};

				scope.deleteFile = function (file) {
					UtilsService.confirm(
						translateFilter('You want to remove the file?'),
						function(index) {
							if (index != 1) return;//stop if not accepted
							files.remove(file).then(function(data) {
								$timeout(function() {
									$log.debug('removed file');
									scope.file = data;
								},0);
							}, function() {
								//error was already logged by the service
								UtilsService.toast(translateFilter('Error removing the file.'));
							});
						}
					);
				};
			} else {
				scope.file.status = files.statuses.open_by_link;
			}
		}
	}
})();
