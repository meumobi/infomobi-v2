angular.module('infoboxApp.controllers.Account', ['infoboxApp.controllers.Main', 'meumobi.api'])

.controller('AccountCtrl', function($rootScope, $scope, $location, Login, AppInfo, AppFunc){
	
	$scope.user = {
		mail:'victor.dias@siemens.com.br', 
		password:'',
		newPassword:'',
		confirmNewPassword : ''
	};


	$scope.PasswordChanger = {
		change : function(){
			if(AppInfo.service.Device.isOnline()){
				if($scope.user.newPassword == $scope.user.confirmNewPassword){
					$scope.PasswordChanger.sendChange();
				}else{
					$scope.PasswordChanger.error({error : "Erro ao confirmar senha"});
				}
			}else{
				$scope.PasswordChanger.error({error : "Conecte-se para alterar a senha"});
			}
		},
		sendChange : function(){
			var userInformation = {current_password : $scope.user.password, password : $scope.user.newPassword}
			Login.save(userInformation,$scope.PasswordChanger.success, $scope.PasswordChanger.error);
		},
		error : function(resp){
			var msg = "";
			if(resp.status == 403){
				msg = "Senha Inválida";
			}else if(resp.status == 401){
				$location.path('login');;
				return false;
			}else{
				msg = resp.error;
			}
			$scope.PasswordChanger.message(msg);
		},
		success : function(resp){
			$scope.PasswordChanger.message("Senha alterada com sucesso");
		},
		message : function(msg){
			AppFunc.toast(msg);
		}
	};


	$scope.logout = function(){
		//MOCK
		//delete localStorage.userToken;
		$rootScope.go('/login');
	}

	$rootScope.loading = false;

});