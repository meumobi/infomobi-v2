'use strict';

var app = angular

.module('infoMobi', [
	"ngCookies",
	'angular-carousel',
	'angular-carousel.shifty',
	'ImgCache',
	'meumobi.directives.DownloadFile',
	'meumobi.Polls',
	'meumobi.services.Auth',
	'meumobi.services.Bootstrap',
	'meumobi.services.Utils',
	'meumobi.services.Version',
	'meumobi.services.Settings',
	'meumobi.stubs',
	'meumobi.directives.uiLadda',
  'meumobi.directives.Headline',
	'mobile-angular-ui',
	'mobile-angular-ui.gestures.swipe',
  'ngMeumobi.Utils',
  'ngMeumobi.Cordova',
  'ngMeumobi.Entities',
	'ngAnimate',
	'ngRoute',
	'ngTouch',
	'pascalprecht.translate',// angular-translate
	'tmh.dynamicLocale', // angular-dynamic-locale
  'angularMoment'
])

.config(function($routeProvider, $locationProvider, $httpProvider, CONFIG) {
  
	$httpProvider.interceptors.push('meuErrorInterceptor');
  $httpProvider.interceptors.push('meuLoadingInterceptor');

	$routeProvider.when('/events/show/:id', {
		templateUrl: "items/show.html",
		controller: "EventsShowController",
    controllerAs: 'vm',
    title: "Eventos" // Should resolve category name here for analytics
	})
	.when('/:type/show/:id', {
		templateUrl: "items/show.html",
		controller: "ShowController",
    controllerAs: 'vm'
	})
	.when('/account', {
		templateUrl: "account.html",
		controller: "AccountController",
    title: "Minha conta"
	})
	.when('/contact', {
		templateUrl: "contact.html",
		controller: "ContactController",
    controllerAs: 'vm',
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
	.when('/items', {
		templateUrl: "items/list.html",
		controller: "ItemsListController",
    controllerAs: 'vm',
    title: "Notícias" // Should resolve category name here for analytics
	})
	.when('/items/list/:id', {
		templateUrl: "items/list.html",
		controller: "ItemsListController",
    controllerAs: 'vm',
    title: "Eventos" // Should resolve category name here for analytics
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
		redirectTo: '/items'
	});
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

.config(function (meuCloudProvider, APP) {
  meuCloudProvider.setOptions({
	  'cdnUrl': APP.cdnUrl,
    'apiUrl': APP.apiUrl,
    'timeout': 12000
	})
	//MeumobiCloudProvider.Settings.language = localStorage.Settings && localStorage.Settings.language ? localStorage.Settings.language : "pt";
})

.config(function (tmhDynamicLocaleProvider) {
	tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
})

.config(function(ImgCacheProvider) {
	// or more options at once
	ImgCacheProvider.setOptions({
		debug: @@debug,
		usePersistentCache: true,
    cacheClearSize: 10
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
		},
		"fade": {
			enter: "fadeIn",
			leave: "fadeOut"
		},
		"fadeDown": {
			enter: "fadeInDown",
			leave: "fadeOutDown"
		},
		"flipX": {
			enter: "flipInX",
			leave: "flipOutX"
		}
	};

	return {
		enter: function(element, done) {       
			if (SharedState.get("transition")) {
				var transform = transition[SharedState.get("transition")];
					return $animateCss(element, {
						event: 'enter',
						structural: true,
						addClass: transform.enter,
					}).start().done(function() {
            /*
              After animation set default animation for a@href links
            */
            //SharedState.set("transition", 'slide-left');
						done();
					})
			} else {
				return $animateCss(element, {}).start().done(function() {
					done();
				})
			}
		},
		leave: function(element, done) {      
			if (SharedState.get("transition")) {
				var transform = transition[SharedState.get("transition")];
					return $animateCss(element, {
						event: 'leave',
						structural: true,
						addClass: transform.leave,
					}).start().done(function() {
            /*
              After animation set default animation for a@href links
            */
            //SharedState.set("transition", 'slide-left');
						done();
					})
			} else {
				return $animateCss(element, {}).start().done(function() {
					done();
				})
			}
		}
	}
}])

.run(function($rootScope, $location, meuCloud, BootstrapService, SharedState, AuthService, $log, UtilsService) {
	
	meuCloud.init();
  $rootScope.flip = UtilsService.nativeFlipTransition;
	
	$rootScope.getImage = meuCloud.getAssetUrl;

	$rootScope.history = window.history;
  $rootScope.go = function(path, transition) {
		if (transition !== undefined) {
			SharedState.set("transition", transition);
			$log.info("Shared State Transition: " + SharedState.get("transition", transition));
		} else {
			SharedState.set("transition", null);
			$log.info("No transition defined");
		}

		$location.path(path);
			//if (window.indexedDB) { alert('WKWebView'); } else { alert('UIWebView'); }
  };

	$rootScope.$on("error:401", function(){
    AuthService.logout();
		$location.path('/login');
	});

	// If it's the first connection redirect to welcome page
	if (!localStorage.hasOwnProperty("device")) {
		$location.path('/login/welcome');
		$log.debug("No Device on localStorage");
	}  else if (!AuthService.isAuthenticated()) {
		AuthService.logout();
		$location.path('/login');
		$log.debug("No authToken on localStorage");
	}  else {
		AuthService.loadAuthToken(localStorage.authToken);
		AuthService.getVisitor();
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
