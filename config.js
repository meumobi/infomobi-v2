module.exports = function(config) {

	// Output directory
	config.dest = 'www';
	
	config.version = "2.1.2"; // version of the App
  
	// Inject cordova script into html
	config.cordova = true;
  
	// Images minification
	config.minify_images = true;

	// Development web server

	config.server.host = '0.0.0.0';
	config.server.port = '8000';
  
	// Set to false to disable it:
	// config.server = false;

	// Weinre Remote debug server
  
	config.weinre.httpPort = 8080;
	// How to get local ip: $ ifconfig |grep inet
	config.weinre.boundHost = '192.168.1.44';

	// Comment to enable weinre, uncomment to disable weinre 
	config.weinre = false;
	config.debug = false;
    
	// 3rd party components
	config.vendor.js.push('./bower_components/angular-touch/angular-touch.js');
	config.vendor.js.push('./bower_components/angular-sanitize/angular-sanitize.min.js');
	config.vendor.js.push('./bower_components/angular-animate/angular-animate.js');
	//config.vendor.js.push('./bower_components/angular-resource/angular-resource.js');
	config.vendor.js.push('./bower_components/angular-carousel/dist/angular-carousel.min.js');
	config.vendor.js.push('./bower_components/ladda/dist/spin.min.js');
	config.vendor.js.push('./bower_components/ladda/dist/ladda.min.js');
	config.vendor.js.push('./bower_components/angular-translate/angular-translate.min.js');
	config.vendor.js.push('./bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js');
	config.vendor.js.push('./bower_components/angular-translate-storage-local/angular-translate-storage-local.min.js');
	config.vendor.js.push('./bower_components/angular-cookies/angular-cookies.min.js');
	config.vendor.js.push('./bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js');
	config.vendor.js.push('./bower_components/angular-translate-handler-log/angular-translate-handler-log.min.js');
	config.vendor.js.push('./bower_components/angular-dynamic-locale/tmhDynamicLocale.min.js');
	config.vendor.js.push('./bower_components/angular-imgcache/angular-imgcache.js');
	config.vendor.js.push(
    './bower_components/imgcache.js/js/imgcache.js',
    './bower_components/ng-meumobi-utils/dist/ng-meumobi-utils.js',
    './bower_components/moment/min/moment.min.js',
    './bower_components/moment/locale/pt-br.js',
    './bower_components/angular-moment/angular-moment.min.js',
    './bower_components/angular-slugify/angular-slugify.js',
    './bower_components/js-md5/js/md5.min.js',
    './bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020.min.js'
  );
	// config.vendor.fonts.push('.bower_components/font/dist/*');
};
