(function() {
	'use strict';
	
	angular
	.module('meumobi.directives.DownloadFile', [])
	.directive('downloadFileControls', downloadFileControls);

	function downloadFileControls($rootScope, translateFilter, meuFiles, $timeout, UtilsService, $log, Items, Media) {
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
      var fileTransfer = null;
			scope.file = meuFiles.decorateFile(scope.file);
      scope.progress = 0;

			scope.download = download;
      scope.openLocalFile = openLocalFile;
      scope.openInAppBrowser = UtilsService.openInAppBrowser;
      scope.abort = abort;      
      // couldn't use special token delete
      scope.deleteFile = deleteFile;
                        
      scope.shareItem = Items.share;
      scope.shareMedia = Media.share;   
      
      var cb_openFile = {
        local: {
          succcess: function() {
            $log.debug("Success to openFile");
          },
          fail: function(error) {
            $log.debug("Failed to openFile");
            $log.debug(error);
            UtilsService.toast(error.message);
          }
        }
      }; 
      
      function openLocalFile(file) {
        meuFiles.open(file).then(
          cb_openFile.local.success, 
          cb_openFile.local.fail
        );
      };
      
      function deleteFile(file) {
				UtilsService.confirm(
					translateFilter('You want to remove the file?'),
					function(index) {
						if (index != 1) return;//stop if not accepted
						meuFiles.remove(file)
              .then(
                function(data) {
                  $log.debug('delete file success cb');
                  $log.debug(data);
							  },
                function(err) {
								  UtilsService.toast(translateFilter(err.message));
							  }
              );
					}
				);
			};
      
      function download(file) {
        fileTransfer = meuFiles.download(file);
        fileTransfer.then(
          function(file) {
            UtilsService.toast(translateFilter('Download finished'));
            openLocalFile(file);
          }, 
          function(error) {
            UtilsService.toast(translateFilter(error.message));
          }, 
          function (progress) {
  					if (progress.lengthComputable) {
  						$timeout(function() {
  							scope.progress =  Math.floor(progress.loaded / progress.total * 100);
  						}, 0);
  					};
          }
        );
      };
      
      function abort() {
        fileTransfer.abort();
      };
			/*
			TODO: isCordovaApp should be a param of directive, to not re-compute at each iteration
			*/
			/*
			media controls are displayed if isApp and file type is known
			https://jsfiddle.net/vrjw7L1k/1/
			use a simple link if not on app or file not allowed for download  
			*/
			
			if (!UtilsService.isCordovaApp() || !meuFiles.isDownloadable(scope.file)) {
        $log.debug('file is downloadable ?: ' + meuFiles.isDownloadable(scope.file));
  			scope.file.status = 'open_by_link';
      } 
	  };
	}
})();
