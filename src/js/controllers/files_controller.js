'use strict';
angular.module('infoboxApp.controllers.Files', [])
.controller('FilesController', function($rootScope, $scope, $window, Files) {
  $scope.downloadedFiles = files.list();
});
