'use strict';

var app = angular.module('InfoBox', [
  'infoboxApp.services.Cordova',
  'ngRoute',
  'ngTouch',
  'ngAnimate',
  'ngSanitize',
  'mobile-angular-ui',
	'infoboxApp.controllers.Main',
	//'ngCachedResource',
	//'services.Analytics',
	'infoboxApp.controllers.Account',
	'infoboxApp.controllers.Contact',
	'infoboxApp.controllers.Login',
	'infoboxApp.controllers.List',
	'infoboxApp.controllers.Show',
	'meumobi.api',
	'meumobi.sync',
	'meumobi.app',
	'meumobi.utils'
])

app.config(function($routeProvider, $locationProvider) {

	$routeProvider.when('/list', {
		templateUrl: "list.html",
		controller: "ListController"
	})
	.when('/show/:id',	{
		templateUrl: "show.html",
		controller: "ShowController"
	})
	.when('/account', {
		templateUrl: "account.html",
		controller: "AccountCtrl"
	})
	.when('/contact', {
		templateUrl: "contact.html",
		controller: "ContactCtrl"
	})
	.when('/login', {
		templateUrl: "login.html",
		controller: "LoginController"
	})
	.when('/about', {
		templateUrl: "about.html"
	})
	.otherwise({redirectTo: '/login'});
})

.run(['$rootScope', '$location', '$window', '$routeParams','Categories', '$http', 'AppInfo', function ($rootScope, $location, $window, $routeParams, Categories, $http, AppInfo) {

	$rootScope.newsList = localStorage.newsList ? JSON.parse(localStorage.newsList) : [];


    $rootScope.go = function (path, pageAnimationClass) {

        if (typeof(pageAnimationClass) === undefined) { // Use a default, your choice
            $rootScope.pageAnimationClass = 'crossFade';
        }else { // Use the specified animation
            $rootScope.pageAnimationClass = pageAnimationClass;
        }

        if (path === 'back') { // Allow a 'back' keyword to go to previous page
            $window.history.back();
        }else { // Go to the specified path
            $location.path(path);
        }

    };

    document.addEventListener("backbutton", function(){
    	if($location.url().indexOf("/show")!=-1){
    		$rootScope.go('back','slideRight');		
    	}
    }, false);


    $rootScope.$on("$routeChangeSuccess", function(a,b,c){
    	if($location.url().indexOf("login")==-1){
			if(localStorage['userToken']){
				if(AppInfo.service.Device.isOnline()){
					Categories.query(
						function(resp){console.log('authorized')
							// authorized user
						},
						function(err){console.log(err,'non authorized')
							// invalid token
							//delete localStorage.userToken;
							//$rootScope.go('/login');
						}
					);
				}
			}else{
				$rootScope.go('/login');	
			}
    	}else{
    		delete localStorage.userToken;
    	}
	});


	
	// MOCK - autoLogin
	if(localStorage['userToken']){
		//$rootScope.go('/list');
	}

}]);



