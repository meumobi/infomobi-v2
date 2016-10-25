'use strict';

angular
.module('infoMobi')
.controller('LoginController', LoginController);

function LoginController(DeviceService, PushService, $rootScope, $http, $scope, $location, API, UtilsService, APP, AuthService, $log, MeumobiCloud, translateFilter, meuAnalytics, meuDialogs) {

	//this should not be scope available, and may be put inside a more reusable place, like a service
	var authenticateUser = function() {
    var defaultLogo = "images/header-color.png";
    
		MeumobiCloud.syncPerformance(
			function(response) {
				var data = response.data;
				data.logo = data.site.hasOwnProperty("logo") && data.site.logo != "" ? APP.cdnUrl + data.site.logo : defaultLogo;
				$rootScope.performance = data;
        MeuAPI.setCategories($rootScope.performance.categories);
        if (data.site && data.site.analytics_token) {
          meuAnalytics.startTrackerWithId(data.site.analytics_token);   
          $log.debug("Own Project Analytics token: " + data.site.analytics_token);       
        } else {
          $log.debug("Infomobi Analytics token");
        }
        $log.debug('categories from performance');
        $log.debug($rootScope.categories);
			}, function(error) {
				$log.debug("MeumobiCloud.syncPerformance ERROR");
				$log.debug(error);
			}
		)
    
		PushService.register(cb_push.register.success, cb_push.register.error);
		$rootScope.go('/items');
	};

	$scope.credentials = {
		email: "",
		password: ""
	};

	var cb_push = {
		register: {
			success: function(token){
				$log.debug("Device token: " + token);
				DeviceService.save(token);
			},
			error: function(){
				DeviceService.save(null);
			}
		}
	};
	
	var cb_auth = {
		login: {
			success: function(response){
				$scope.Login.loading = false;
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
				$scope.Login.loading = false;
				meuDialogs.toast(msg);
				$log.debug(msg)
			}
		}
	};
	
	var cb_login = { 
		save: {
			success: function(response) {
				meuDialogs.toast(translateFilter("password.save.Success"));
				AuthService.loadAuthToken(response.data.token);
				$rootScope.Ui.turnOff('modal1');
				authenticateUser();
			},
			error: function(response) {
				var msg = translateFilter("password.save.Error");
				if (response.data && response.data.error) {
					msg += ": " + translateFilter("[API]: " + response.data.error);
				} else {
					msg += ": " + translateFilter("default.network.Error");
				}
				meuDialogs.toast(msg);
			}
		}
	};

	$scope.Login = {
		submitForm: function(isValid) {
			$scope.submitted = true;
			if (!isValid) {
				meuDialogs.toast('Erro de validação');
			}
			else {
        // Login.loading used by Ladda on submit button
				$scope.Login.loading = true;
				$scope.Login.signin($scope.credentials);
			}
		},
		signin: function(credentials) {
			AuthService.login(credentials, cb_auth.login.success, cb_auth.login.error)
		},

		changePassword: function() {
			var payload = {
				current_password: $scope.credentials.password,
				password: $scope.Login.new_password
			};
			
			API.Login.save(payload, cb_login.save.success, cb_login.save.error);
		}
	}
}
