'use strict';

var app = angular

.module('infoMobi', [
	'meumobi.services.Device',
	'meumobi.services.Version',
	'meumobi.services.Auth',
	'meumobi.services.Utils',
	'meumobi.services.Bootstrap',
	'meumobi.services.Push',
	'ngRoute',
	'ngTouch',
	'angular-carousel',
	'angular-carousel.shifty',
	'ngAnimate',
	'ngSanitize',
	'mobile-angular-ui',
	'mobile-angular-ui.gestures.swipe',
	'services.Analytics',
	'meumobi.api',
	'meumobi.settings',
	'meumobi.appFunc',
	'meumobi.utils',
	'meumobi.filters.Common',
	'meumobi.filters.DownloadFiles',
	'meumobi.stubs',
	'meumobi.services.Files',
	'meumobi.directives.DownloadFile',
	'pascalprecht.translate',// angular-translate
	'tmh.dynamicLocale',// angular-dynamic-locale
	"ngCookies",
	'ImgCache'
])

.config(function($routeProvider, $locationProvider, $httpProvider, analyticsProvider, CONFIG) {
	$httpProvider.interceptors.push('errorInterceptor');
	$httpProvider.defaults.timeout = 5000;

	$routeProvider.when('/list', {
		templateUrl: "list.html",
		controller: "ListController",
    title: "Notícias"
	})
	.when('/show/:id', {
		templateUrl: "show.html",
		controller: "ShowController",
		title: "Show"
/*		resolve: {
			viewName: function($route, $rootScope) {
				//obs. this shoud be a service not a global rootScope property, but is using the implementatiopn of showController
				var item = $rootScope.news[$route.current.params.id];
				if (item)
					$route.current.$$route.title = item.title;
			}
		}
*/
	})
	.when('/account', {
		templateUrl: "account.html",
		controller: "AccountController",
    title: "Minha conta"
	})
	.when('/contact', {
		templateUrl: "contact.html",
		controller: "ContactController",
    title: "Fale com a Comunicação Interna"
	})
	.when('/login', {
		templateUrl: "login.html",
		controller: "LoginController",
    title: "Login"
	})
	.when('/about', {
		templateUrl: "about.html",
    title: "Sobre a Siemens"
	})
	.when('/files', {
		templateUrl: "files.html",
		controller: "FilesController",
    title: "Arquivos"
	})
	.when('/login/forgot', {
		templateUrl: "forgot.html",
		controller: "ForgotController",
    title: "Esqueci minha senha"
	})
	.when('/login/welcome', {
		templateUrl: "welcome.html",
		controller: "WelcomeController",
    title: "Bem Vindo"
	})
	.otherwise({
		redirectTo: '/list'
	});

	analyticsProvider.setup(CONFIG.ANALYTICS.trackId);
})

.config(function ($translateProvider) {
	// To get warnings in the developer console, regarding forgotten IDs in translations
	$translateProvider.useMissingTranslationHandlerLog();
	
	$translateProvider.useStaticFilesLoader({
		prefix: 'locales/',// path to translations files
		suffix: '.json'// suffix, currently- extension of the translations
	});
	$translateProvider.preferredLanguage('pt_BR');// is applied on first load
	$translateProvider.useLocalStorage();// saves selected language to localStorage
})

.config(function (tmhDynamicLocaleProvider) {
	tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
})

.config(function(ImgCacheProvider) {
	// or more options at once
	ImgCacheProvider.setOptions({
		debug: @@debug,
		usePersistentCache: true
	});

	// ImgCache library is initialized automatically,
	// but set this option if you are using platform like Ionic -
	// in this case we need init imgcache.js manually after device is ready
	ImgCacheProvider.manualInit = true;
})

.config(['$logProvider', function($logProvider){
    $logProvider.debugEnabled(@@debug);
}])

.config(
	function configureAnimate( $animateProvider ) {
		$animateProvider.classNameFilter( /\banimated\b/ );
	}
)

.animation('.slide', ['$animateCss', '$rootScope', '$log', 'SharedState', function($animateCss, $rootScope, $log, SharedState) {
	
	var transition = {
		"slide-left": {
			enter: "slideInRight",
			leave: "slideOutLeft"
		},
		"slide-right": {
			enter: "slideInLeft",
			leave: "slideOutRight"
		}
	}

	/*var transition = {
		"slide-left": {
			enter: {
			  from: {
			    "-webkit-transform": "translate3d(100%, 0, 0)",
			    transform: "translate3d(100%, 0, 0)",
			  },

			  to: {
			    "-webkit-transform": "translate3d(0, 0, 0)",
			    transform: "translate3d(0, 0, 0)"
			  }
			},
			leave: {
			  from: {
			    "-webkit-transform": "translate3d(0, 0, 0)",
			    transform: "translate3d(0, 0, 0)"
			  },

			  to: {
			    "-webkit-transform": "translate3d(-100%, 0, 0)",
			    transform: "translate3d(-100%, 0, 0)"
			  }
			}
		},
		"slide-right": {
			enter: {
			  from: {
			    "-webkit-transform": "translate3d(-100%, 0, 0)",
			    transform: "translate3d(-100%, 0, 0)",
			  },

			  to: {
			    "-webkit-transform": "translate3d(0, 0, 0)",
			    transform: "translate3d(0, 0, 0)"
			  }
			},
			leave: {
			  from: {
			    "-webkit-transform": "translate3d(0, 0, 0)",
			    transform: "translate3d(0, 0, 0)"
			  },

			  to: {
			    "-webkit-transform": "translate3d(100%, 0, 0)",
			    transform: "translate3d(100%, 0, 0)"
			  }
			}
		}
	}*/

	return {
		enter: function(element, done) { 
			$log.debug(".animation SharedState: " + SharedState.get("transition"));
			if (SharedState.get("transition")) {
				var transform = transition[SharedState.get("transition")];
					return $animateCss(element, {
						event: 'enter',
						structural: true,
						addClass: transform.enter,
						//from: transform.enter.from,
					  //to: transform.enter.to,
						// duration: 10.35
						
					}).start().done(function() {
						$log.debug("done enter " + transform.enter);
						$log.debug(SharedState.values());
						done();
					})
			} else {
				return $animateCss(element, {}).start().done(function() {
					$log.debug("Nothing done");
					done();
				})
			}
		},
		leave: function(element, done) {
			$log.debug(".animation SharedState: " + SharedState.get("transition"));
			if (SharedState.get("transition")) {
				var transform = transition[SharedState.get("transition")];
					return $animateCss(element, {
						event: 'leave',
						structural: true,
						addClass: transform.leave,
						//from: transform.leave,
					  // to: transform.leave,
						// duration: 10.35
					}).start().done(function() {
						$log.debug("done leave " + transform.leave);
						done();
					})
			} else {
				return $animateCss(element, {}).start().done(function() {
					$log.debug("Nothing done");
					done();
				})
			}
		}
	}
	
}])

.run(function($rootScope, $location, $http, analytics, AppFunc, APP, BootstrapService, SharedState, DeviceService, AuthService, $log, UtilsService) {
	
	$rootScope.history = window.history;
	// $rootScope.go = AppFunc.transition;
  $rootScope.go = function(path, transition) {
		SharedState.set("transition", transition); 
		$log.info("Shared State Transition: " + SharedState.get("transition", transition));
		$location.path(path);
			//if (window.indexedDB) { alert('WKWebView'); } else { alert('UIWebView'); }
  };
	
	$rootScope.getImage = AppFunc.getImage;
	
	// $rootScope.user = localStorage.user ? JSON.parse(localStorage.user) : "";
	// $http.defaults.headers.common['X-Visitor-Token'] = $rootScope.user.token;
	$rootScope.$on('loading:show', function() {
		// $rootScope.loading = true;
	})

	$rootScope.$on('loading:hide', function() {
		// $rootScope.loading = false;
	})

	$rootScope.$on("logout", function(){
		$log.debug("$on.logout"); // $emit if Api returns 401
		AuthService.logout();
		$location.path('/login');
		//$rootScope.flip('#/login');
	});

	$rootScope.$on('$routeChangeSuccess', function(e, current, prev) {
		//send page to analytics
		// analytics.trackPage(current.$$route.title);
	});

	$rootScope.flip = UtilsService.nativeFlipTransition;

	$rootScope.versionServiceIsEnabled = false;

	// If it's the first connection redirect to welcome page
	if (!localStorage.hasOwnProperty("device")) {
		$location.path('/login/welcome');
		$log.debug("No Device on localStorage");
	}  else if (!AuthService.isAuthenticated()) {
		AuthService.logout();
		$log.debug("No authToken on localStorage");
	}  else {
		AuthService.loadAuthToken(localStorage.authToken);
		AuthService.getVisitor();
		$rootScope.news = localStorage.news ? JSON.parse(localStorage.news) : [];
	}

	BootstrapService.startApp();

	$rootScope.$on('$locationChangeStart', function (event, next, current) {
		// redirect to login page if not logged in and trying to access a restricted page
		/*var restrictedPage = $location.path().indexOf('login') == -1;
		var loggedIn = $rootScope.authToken ? $rootScope.authToken : false;
		$rootScope.NavBarBottom = restrictedPage; //loggedIn|| $location.path().indexOf('login') == -1) ? true : false;
		if (restrictedPage && !loggedIn) {
			$location.path('/login');
		}
		// redirect to /list if loggedIn and try to access non-restricted page
		if (!restrictedPage && loggedIn) {
			$location.path('/list');
		}*/
		$rootScope.NavBarBottom = $location.path().indexOf('login') == -1;
		$rootScope.NavBarTop = ($location.path() == "/login") ? false : true;
	});
});
