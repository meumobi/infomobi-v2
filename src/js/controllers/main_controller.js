'use strict';

angular
.module('infoMobi')
.controller('MainController', MainController);

function MainController($rootScope, $scope, $location, AuthService, API) {
		
	$scope.userAgent = navigator.userAgent;

	$scope.mailto = function(e) {
		if (window.plugins && window.plugins.emailComposer) {
			window.plugins.emailComposer.showEmailComposerWithCallback(console.log("Email callback " + e),
			"Want to know more about infoBox...", "Please send me more details.", ["infobox@siemens.com.br"], null, null, false, null, null);
		} else {
			location.href = 'mailto:infobox@siemens.com.br?subject=Question about media infoBox&body=';
		}
	}

	$scope.logout = function() {
		AuthService.logout();
		$rootScope.flip('#/login');
	}

	$scope.Poll = {
		submit: function(vote, id) {
			console.log(vote);
			var obj = {};
			obj.vote = vote;
			obj.id = id;
			API.Poll.submit(obj, $scope.Poll.success, $scope.Poll.error);
		},
		success: function(resp) {
			console.log(resp);
			AppFunc.toast("Mensagem enviada com sucesso");
		},
		error: function(err) {
			console.log(err);
			AppFunc.toast("Erro ao enviar mensagem");
		}
	}
}
