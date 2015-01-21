'use strict';

angular.module('infoboxApp.controllers.Files', [])
.controller('FilesController', function($rootScope, $scope, $window) {

    /**
    * Read all entries (files or dirs) of a given directory.
    */
    $scope.readLocalDir = function (dir) {
        var directoryReader = dir.createReader();
        directoryReader.readEntries(function(entries) {
            var i;
            var files = [];
            for (i=0; i<entries.length; i++) {
                var e = entries[i];
                if (e.isFile) {
                    var fname = localStorage[e.name];
                    if (!fname) { fname = e.name; }
                    files.push({
                        name: fname,
                        path: e.nativeURL,
                        type: localStorage[e.name+"type"]
                    });
                }
            }
            $scope.$apply(function () {
                $scope.downloadedFiles = files;
            });
        }, function (error) {
            console.log(error.code);
        });
    };

    /**
    * Error handler of resolveLocalFileSystemURL.
    */
    $scope.errorHandler = function (e) {
        console.log(e);
    };

    /**
    * Access the data directory.
    */
    $scope.resolveFileSystem = function () {
        var localDir;
        if (device.platform.toLowerCase() == "android") {
            localDir = cordova.file.externalRootDirectory+"/infobox/Downloads";
        } else {
            localDir = cordova.file.dataDirectory;
        }
        $window.resolveLocalFileSystemURL(
            localDir, 
            $scope.readLocalDir,
            $scope.errorHandler
        );
    };

    /**
    * Open file.
    */
    $scope.openFile = function (file) {
        cordova.plugins.fileOpener2.open(file.path, file.type);
    };
    
    $scope.resolveFileSystem();
});

 