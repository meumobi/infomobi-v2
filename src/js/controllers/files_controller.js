'use strict';

angular
	.module('InfoBox')
	.controller('FilesController', FilesController);

	function FilesController($rootScope, $scope, $window, Files) {
		$scope.downloadedFiles = Files.list();
	}
