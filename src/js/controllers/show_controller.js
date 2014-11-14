'use strict';

angular.module('infoboxApp.controllers.Show', ['meumobi.api'])

.controller('ShowController', function($rootScope, $scope, $sce, $routeParams, Items){

	$rootScope.$on("$routeChangeStart", function(){
		$rootScope.loading = true;
	});

    $scope.getTrustedResourceUrl = function(src) {
        return $sce.trustAsResourceUrl(src);
    }

	Items.get({'id':$routeParams.id},
		function(data){
			$scope.item = data;
			$rootScope.loading = false;
		},
		function(error) {
			console.log("Request Failed:" + error);
		});
});

 