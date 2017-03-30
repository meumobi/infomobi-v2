'use strict';

angular
.module('infoMobi')
.controller('LoginController', LoginController);

function LoginController($rootScope, $scope, AuthService, $log, translateFilter, meuCordova, meuCloud, Site) {

	//this should not be scope available, and may be put inside a more reusable place, like a service
  var activate = function() {
    $log.debug('Api url: ' + meuCloud.API.Config.getProperty('apiUrl'));
    $log.debug('Api domain: ' + meuCloud.API.Config.getProperty('domain'));
    meuCloud.API.Site.performance()
    .then(function(response) {
      updateDatas(response);
      if (response.promise)
        return response.promise;
    })
    // If response contains a promise, means is from cache and promise will sync w/ Server
    .then(function(response) {
      updateDatas(response)
    })
    .catch(function(e) {
      $exceptionHandler(e);
    })
  };
  
  var updateDatas = function(response) {
    var data = response.data;

    meuCloud.syncPerformance(data)
    .then(function(data) {
      Site.updateAnalytics();
      
      //vm.data = data;
      data.logo = meuCloud.getSiteLogoUrl();
      $rootScope.performance = data;
    });
  };
  
	var authenticateUser = function() {
    var defaultLogo = "images/header-color.png";
    
		activate();
    
    AuthService.registerPush();
    
    $rootScope.go('/items');
	};

	$scope.credentials = {
		email: "",
		password: ""
	};
	
	var cb_auth = {
		login: {
			success: function(response){
				$scope.Login.isLoading = false;
				//show modal if need change password, otherwise authenticate
				if (response.data && response.data.error) {
					if (response.data.error == "password expired") {
						$scope.visitor = response.data.visitor;
						$rootScope.Ui.turnOn('modal1');
					} 
				} else {
					authenticateUser();
				} 
			},
			error: function(response){
				var msg = translateFilter("auth.login.Error");
				if (response.data && response.data.error) {
					msg += ": " + translateFilter("[API]: " + response.data.error);
				} else {
					msg += ": " + translateFilter("default.network.Error");
				}
				$scope.Login.isLoading = false;
				meuCordova.dialogs.toast(msg);
				$log.debug(msg)
			}
		}
	};
	
	var cb_login = { 
		save: {
			success: function(response) {
				meuCordova.dialogs.toast(translateFilter("password.save.Success"));
				AuthService.loadAuthToken(response.data.token);
				$rootScope.Ui.turnOff('modal1');
        $scope.Login.isLoading = false;
				authenticateUser();
			},
			error: function(response) {
				var msg = translateFilter("password.save.Error");
				if (response.data && response.data.error) {
					msg += ": " + translateFilter("[API]: " + response.data.error);
				} else {
					msg += ": " + translateFilter("default.network.Error");
				}
				meuCordova.dialogs.toast(msg);
        $scope.Login.isLoading = false;
			}
		}
	};

	$scope.Login = {
		submitForm: function(isValid) {
			$scope.submitted = true;
			if (!isValid) {
				meuCordova.dialogs.toast('Erro de validação');
			}
			else {
        // Login.loading used by Ladda on submit button
				$scope.Login.isLoading = true;
				$scope.Login.signin($scope.credentials);
			}
		},
		signin: function(credentials) {
			AuthService.login(credentials)
      .then(cb_auth.login.success)
      .catch(cb_auth.login.error);
		},

		changePassword: function() {
      $scope.Login.isLoading = true;
			var payload = {
				current_password: $scope.credentials.password,
				password: $scope.Login.new_password
			};
			
			meuCloud.API.Login.save(payload)
      .then(cb_login.save.success)
      .catch(cb_login.save.error);
		}
	}
}
