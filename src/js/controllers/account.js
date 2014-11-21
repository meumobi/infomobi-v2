angular.module('infoboxApp.controllers.Account', ['infoboxApp.controllers.Main', 'meumobi.api'])

.controller('AccountCtrl', function($scope, $location, Login){
	
	$scope.user = {
		mail:'victor.dias@siemens.com.br', 
		password:'',
		newPassword:'',
		confirmNewPassword : ''
	};


	$scope.PasswordChanger = {
		isOnline : function(){
			var connection = false;
			if(navigator.connection){
				var networkState = navigator.connection.type;

			    var states = {};
			    states[Connection.UNKNOWN]  = false;
			    states[Connection.ETHERNET] = true;
			    states[Connection.WIFI]     = true;
			    states[Connection.CELL_2G]  = true;
			    states[Connection.CELL_3G]  = true;
			    states[Connection.CELL_4G]  = true;
			    states[Connection.CELL]     = true;
			    states[Connection.NONE]     = false;

			    connection = states[networkState] ? true : false;
			}else{
				connection = navigator.onLine;
			}
			return connection;
		},
		change : function(){
			if($scope.PasswordChanger.isOnline){
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
		error : function(resp){console.log(resp,5555)
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
			if (window.plugins && window.plugins.toast) {
				window.plugins.toast.showLongBottom(msg, 
					function(a){
						console.log('toast success: ' + a)
					},
					function(b){
						console.log('toast error: ' + b)
					}
				);
			} else {
				alert(msg);
			}
		}
	};


	$scope.logout = function(){
		//MOCK
		delete localStorage.userToken;
		$location.url('/login');
	}

});