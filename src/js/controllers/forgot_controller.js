'use strict';

angular.module('infoboxApp.controllers.Forgot', [])

.controller('ForgotCtrl', function($rootScope, $scope, API, AppFunc){

	$rootScope.loading = false;

  $scope.Forgot = {
    informations : {
      name : "infobox",
      mail : localStorage.mail ? localStorage.mail : "contact@meumobi.com",
      message : ""
    },
    sendMail : function(){
      $rootScope.loading = true;
      API.Mail.save($scope.Forgot.informations,$scope.Forgot.success,$scope.Forgot.error);
    },
    success : function(resp){
      console.log(resp);
      AppFunc.toast("Nova senha enviada com sucesso.");
      $scope.Forgot.informations.message = "";
      $rootScope.loading = false;
    },
    error : function(err){
      console.log(err);
      AppFunc.toast("Erro ao enviar a nova senha.");
      $rootScope.loading = false;
    }
  }
});

 