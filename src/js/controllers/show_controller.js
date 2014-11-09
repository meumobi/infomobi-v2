'use strict';

angular.module('infoboxApp.controllers.Show', [])

.controller('ShowController', function($rootScope, $scope, $sce, $routeParams, Items){

	$rootScope.$on("$routeChangeStart", function(){
		$rootScope.loading = true;
	});

	$rootScope.$on("$routeChangeSuccess", function(){
		$rootScope.loading = false;
	});

    $scope.getTrustedResourceUrl = function(src) {
        return $sce.trustAsResourceUrl(src);
    }

	/*Articles.get().then(function(data){
		$scope.item = data.items[$routeParams.index];
		//$scope.ready = true;
		//console.log($scope.articles);
	});*/

});

 