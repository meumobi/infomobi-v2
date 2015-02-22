'use strict';

angular.module('infoboxApp.controllers.Files', [])
.controller('FilesController', function($rootScope, $scope, $window, DonwloadedFiles) {

    /**
    * Load downloaded files.
    */
    $scope.resolveFileSystem = function () {
        DonwloadedFiles.loadFiles(function (files) {
            $scope.$apply(function () {
                $scope.downloadedFiles = files;
            });
        });
    };

    /**
    * Open file.
    */
    $scope.openFile = function (file) {
        cordova.plugins.fileOpener2.open(file.path, file.type);
    };

    /**
    * Delete file.
    */
    $scope.deleteFile = function (file) {
        var shouldDelete = $window.confirm("Deseja remover o arquivo?");
        if (!shouldDelete) { return; }
        file.fileEntry.remove(function (file) {
            $scope.resolveFileSystem();
        },function () {
            $window.alert("Erro ao deletar o arquivo.");
        },function () {
            $window.alert("Este arquivo não existe mais.");
            $scope.resolveFileSystem();
        });
    };

    //Init.
    $scope.resolveFileSystem();

    /**
    * Listen for new file donwloaded event.
    */
    $rootScope.$on('fileDownloaded', function () {
        $scope.resolveFileSystem();
    });
});