'use strict';

angular
	.module('infoMobi')
	.controller('FilesController', FilesController);

	function FilesController($rootScope, $scope, $window, files) {
		$scope.downloadedFiles = files.list();
	}
