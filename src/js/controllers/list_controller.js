'use strict';

angular.module('infoboxApp.controllers.List', ['infoboxApp.services.Meumobi'])

.controller('ListController', function($rootScope, $scope, Articles){

	$rootScope.$on("$routeChangeStart", function(){
		$rootScope.loading = true;
	});

	$rootScope.$on("$routeChangeSuccess", function(){
		$rootScope.loading = false;
	});

	/*Articles.get().then(function(data){
		$scope.articles = data.items;
		//$scope.ready = true;
		//console.log($scope.articles);
	});*/


});

 