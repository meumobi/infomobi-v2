'use strict';

angular.module('infoboxApp.controllers.Login', [])

.controller('LoginController', function($rootScope, $scope){

  $rootScope.$on("$routeChangeStart", function(){
    $rootScope.loading = true;
  });

  $rootScope.$on("$routeChangeSuccess", function(){
    $rootScope.loading = false;
  });
  
  $scope.teste = "Hello";

});

 