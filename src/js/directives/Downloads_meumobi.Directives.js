(function() {
	'use strict';
	
	angular
	.module('meumobi.directives.DownloadFile', [])
	.directive('downloadFileControls', downloadFileControls);

	function downloadFileControls($rootScope, translateFilter, meuCordova, $timeout, UtilsService, $log, Items, Media) {
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
			scope.file = meuCordova.files.decorateFile(scope.file);
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
            meuCordova.dialogs.toast(error.message);
          }
        }
      }; 
      
      function openLocalFile(file) {
        meuCordova.files.open(file).then(
          cb_openFile.local.success, 
          cb_openFile.local.fail
        );
      };
      
      function deleteFile(file) {
				meuCordova.dialogs.confirm(
					translateFilter('You want to remove the file?'))
          .then(function(index) {
            if (index != 1) return; //stop if not accepted
            return meuCordova.files.remove(file);
          })
          .then(function(data) {
            $log.debug('delete file success cb');
            $log.debug(data);
          })
          .catch(function(e) {
            $exceptionHandler(e);
          })
			};
      
      function download(file) {
        fileTransfer = meuCordova.files.download(file);
        fileTransfer.then(
          function(file) {
            meuCordova.dialogs.toast(translateFilter('Download finished'));
            openLocalFile(file);
          }, 
          function(error) {
            meuCordova.dialogs.toast(translateFilter(error.message));
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
			
			if (!UtilsService.isCordovaApp() || !meuCordova.files.isDownloadable(scope.file)) {
        $log.debug('file is downloadable ?: ' + meuCordova.files.isDownloadable(scope.file));
  			scope.file.status = 'open_by_link';
      } 
	  };
	}
})();
