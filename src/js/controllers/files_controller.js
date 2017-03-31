'use strict';

angular
	.module('infoMobi')
	.controller('FilesController', FilesController);

	function FilesController($rootScope, $scope, $window, meuCordova) {
		$scope.downloadedFiles = meuCordova.files.list();
	}
