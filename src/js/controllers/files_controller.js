'use strict';

angular
	.module('infoMobi')
	.controller('FilesController', FilesController);

	function FilesController($rootScope, $scope, $window, Files) {
		$scope.downloadedFiles = Files.list();
	}
