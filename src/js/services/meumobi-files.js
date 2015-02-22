'use strict';

angular.module('meumobi.files', [])

.factory('DonwloadedFiles', function ($window) {
	var DonwloadedFiles = {
		/**
	    * Error handler of resolveLocalFileSystemURL.
	    */
	    errorHandler: function (e) {
	        console.log(e);
	    },

	    /**
	    * Access the data directory.
	    */
	    loadFiles: function (callback) {
	        var localDir;
	        if (device.platform.toLowerCase() == "android") {
	            localDir = cordova.file.externalRootDirectory+"/infobox/Downloads";
	        } else {
	            localDir = cordova.file.dataDirectory;
	        }
	        $window.resolveLocalFileSystemURL(
	            localDir, 
	            //Read all entries (files or dirs) of a given directory.
	            function (dir) {
	            	var self = this;
			        var directoryReader = dir.createReader();
			        directoryReader.readEntries(function(entries) {
			            var i;
			            var files = [];
			            for (i=0; i<entries.length; i++) {
			                var e = entries[i];
			                if (e.isFile) {
			                    var fname = localStorage[e.name];
			                    if (fname) {
			                    	files.push({
				                        name: fname,
				                        path: e.nativeURL,
				                        type: localStorage[e.name+"type"],
				                        fileEntry: e
				                    });
			                    }
			                }
			            }
			            callback(files);
			        }, function (error) {
			            console.log(error.code);
			        });
	            },
	            this.errorHandler
	        );
	    }
	};
	return DonwloadedFiles;
})