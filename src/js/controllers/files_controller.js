'use strict';
angular
  .module('infoboxApp.controllers.Files', [])
  .controller('FilesController', FilesController);

  function FilesController($rootScope, $scope, $window, Files) {
    $scope.downloadedFiles = Files.list();
  }
