'use strict';

angular
	.module('infoMobi')
	.controller('FilesController', FilesController);

	function FilesController($rootScope, $scope, $window, meuFiles) {
		$scope.downloadedFiles = meuFiles.list();
	}
