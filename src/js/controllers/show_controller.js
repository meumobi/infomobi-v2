'use strict';

angular.module('infoboxApp.controllers.Show', [])

.controller('ShowController', function($rootScope, $scope, $sce, $routeParams, API, SITE){

  $scope.localFolderPath = cordova.file.applicationStorageDirectory 
    + "Documents";

  $scope.getTrustedResourceUrl = function(src) {
      return $sce.trustAsResourceUrl(src);
  }

  $scope.loadURL = function (url) {
      //target: The target in which to load the URL, an optional parameter that defaults to _self. (String)
      //_self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.
      //_blank: Opens in the InAppBrowser.
      //_system: Opens in the system's web browser.
      window.open(url,'_blank');
  }
  
  $scope.shareFeed = function () {
      
      var subject = $scope.item.title;
      var message = $scope.item.description;
      message = message.replace(/(<([^>]+)>)/ig,"");

      var link = $scope.item.link;
      
      //Documentation: https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin
      //window.plugins.socialsharing.share('Message', 'Subject', 'Image', 'Link');
      window.plugins.socialsharing.share(message, subject, null, link);
  }

	$rootScope.loading = false;

  $scope.item = $rootScope.newsList[$routeParams.id];
  

  $scope.getImage = function(id){
    /*if(localStorage["image_"+id]){
      return localStorage["image_"+id];
    }*/
    return SITE.SRC_URL+id;
  }

  /**
  * Download file to local folder.
  */
  $scope.downloadFile = function (media, $event) {
    if ($event.target.disabled) { return; }
    $event.target.disabled = true;
    var html = $event.target.innerHTML;
    $event.target.innerHTML = "Baixando...";
    var localPath = $scope.localFolderPath + "/" + media.title;
    var fileTransfer = new FileTransfer();
    var uri = encodeURI(media.url);
    fileTransfer.download(uri, localPath, function(entry) {
        window.plugins.toast.showShortBottom("Download concluído");
        $event.target.innerHTML = "Download concluído";
      }, function(error) {
        window.plugins.toast.showShortBottom("Falha no Download");
        $event.target.innerHTML = html;
        $event.target.disabled = false;
    }, false);
  }
});

 