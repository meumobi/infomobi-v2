/* jshint node: true, strict: true */
'use strict';

/*=====================================
=        Default Configuration        =
=====================================*/

// Please use config.js to override these selectively:

var config = {
  dest: 'www',
  cordova: true,
  less: {
    src: [
      './src/less/app.less', './src/less/responsive.less'
    ],
    paths: [
      './src/less', './bower_components'
    ]
  },
  vendor: {
    js: [
      './bower_components/angular/angular.js',
      './bower_components/angular-route/angular-route.js',
      './bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.js',
			'./bower_components/mobile-angular-ui/dist/js/mobile-angular-ui.gestures.js'
    ],

    css: {
      prepend: [],
      append: ['./src/css/animate.css'],
    },

    fonts: [
      './bower_components/font-awesome/fonts/fontawesome-webfont.*'
    ]
  },

  server: {
    host: '0.0.0.0',
    port: '8000'
  },

  weinre: {
    httpPort:     8001,
    boundHost:    'localhost',
    verbose:      false,
    debug:        false,
    readTimeout:  5,
    deathTimeout: 15
  }
};

if (require('fs').existsSync('./config.js')) {
  var configFn = require('./config');
  configFn(config);
}

/*-----  End of Configuration  ------*/


/*========================================
=            Requiring stuffs            =
========================================*/

var gulp = require('gulp'),
	$ = require('gulp-load-plugins')(),

	seq = require('run-sequence'),
	less = require('gulp-less'),
	order = require('gulp-order'),
	ignore = require('gulp-ignore'),
	pngcrush = require('imagemin-pngcrush'),
	templateCache = require('gulp-angular-templatecache'),
	mobilizer = require('gulp-mobilizer'),
	ngFilesort = require('gulp-angular-filesort'),
	streamqueue = require('streamqueue'),
	path = require('path'),
	args = require('yargs').argv,
	fs = require('fs');

/*================================================
=            Report Errors to Console            =
================================================*/

gulp.on('err', function(e) {
	throw(e);
	//console.log(e.err.stack);
});

/*================================================
=            Manage projects and envs            =
================================================*/

// Get the project from the command line
var project = args.project || null;

// Get the environment from the command line
var env = args.env || null;
var cwd = './PROJECTS/' + project;

// Read the Environment & App Settings
var filename = env ? env + '.json': null;

if (filename !== null && cwd !== null) {
	var configEnv = JSON.parse(fs.readFileSync(path.join(cwd, 'environments', filename), 'utf8'));
	var configProject = JSON.parse(fs.readFileSync(path.join(cwd,'config.json'), 'utf8'));

	console.log(
		"==== Gulp infoMobi: Project="
		+ configProject.name
		+ config.version
		+ ", Environment="
		+ env
	);

	if (config.debug) {
		console.log("/!\\ === Be careful It's a debug release === /!\\ ");
		console.log("Set config.debug = false on gulpfile.js to submit");
	}
}

gulp.task('help', $.taskListing);


/*================================================
=                  Copy App Assets               =
================================================*/

// Copy APP Assets, maintaining the original directory structure
gulp.task('copy', function () {
	return gulp.src('./res/**/*', {
		cwd: cwd
	})
	.pipe(gulp.dest(path.join(config.dest, 'res')))
});

// .pgbomit signifies to PhoneGap Build that it SHOULD NOT include the contents of that directory in the app package
// http://phonegap.com/blog/2014/04/11/phonegap-build-adds-some-new-features
gulp.task('pgbomit', ['copy'], function (){
	fs.writeFileSync(path.join(config.dest, 'res') + "/.pgbomit", '');
}); 

// Copy Default APP icon on root
gulp.task('copy-icon', function () {
	return gulp.src('./res/icon/ios/AppIcon.appiconset/Icon-60@2x.png', {
		cwd: cwd
	})
	.pipe($.rename('icon.png'))
	.pipe(gulp.dest(config.dest))
});

// Copy Default APP splash on root
gulp.task('copy-splash', function () {
	return gulp.src('./res/screen/ios/Default.png', {
		cwd: cwd
	})
	.pipe($.rename('splash.png'))
	.pipe(gulp.dest(config.dest))
});


/*=========================================
=            Clean dest folder            =
=========================================*/

gulp.task('clean', function(cb) {
	return gulp.src([
		path.join(config.dest, 'index.html'),
		path.join(config.dest, 'images'),
		path.join(config.dest, 'css'),
		path.join(config.dest, 'js'),
		path.join(config.dest, 'fonts'),
		path.join(config.dest, 'res'),
		path.join(config.dest, 'icon.png'),
		path.join(config.dest, 'splash.png'),
		path.join(config.dest, 'config.xml'),
		path.join(config.dest, 'locales')
	], {
		read: false
	})
	.pipe($.rimraf());
});


/*==========================================
=            Start a web server            =
==========================================*/

gulp.task('connect', function() {
	if (typeof config.server === 'object') {
		$.connect.server({
			root: config.dest,
			host: config.server.host,
			port: config.server.port,
			livereload: true
		});
	} else {
		throw new Error('Connect is not configured');
	}
});


/*==============================================================
=            Setup live reloading on source changes            =
==============================================================*/

gulp.task('livereload', function() {
	gulp.src(path.join(config.dest, '*.html'))
	.pipe($.connect.reload());
});


/*=====================================
=            Minify images            =
=====================================*/

gulp.task('images', function() {
	var streamBuildAction = streamqueue({
		objectMode: true
	},
	gulp.src('src/images/**/*'),
	gulp.src('./images/**/*', {cwd: cwd})
);
return streamBuildAction
.pipe($.if(config.minify_images, $.imagemin({
	progressive: true,
	svgoPlugins: [{
		removeViewBox: false
	}],
	use: [pngcrush()]
})))
.pipe(gulp.dest(path.join(config.dest, 'images')));
});

/*==================================
=            Copy fonts            =
==================================*/

gulp.task('fonts', function() {
return gulp.src(
	config.vendor.fonts)
	.pipe(gulp.dest(path.join(config.dest, 'fonts')));
});


/*=================================================
=            Copy html files to dest              =
=================================================*/

gulp.task('html', function() {
	var inject = [];
	if (typeof config.weinre === 'object' && config.debug) {
		inject.push('<script src="http://' + config.weinre.boundHost + ':' + config.weinre.httpPort + '/target/target-script-min.js"></script>');
	}
	if (config.cordova) {
		inject.push('<script src="cordova.js"></script>');
	}
	return gulp.src(['src/html/**/*.html'])
	.pipe($.replace('<!-- inject:js -->', inject.join('\n    ')))
	.pipe($.replace('@@name', configProject.name))
	.pipe(gulp.dest(config.dest));
});


/*======================================================================
=            Compile, minify, mobilize less                            =
======================================================================*/

gulp.task('less', function() {
	streamqueue({ objectMode: true },
    gulp.src(config.less.src)
			.pipe($.replace("@@brandPrimary", configProject.CONFIG.STYLE.brandPrimary))
			.pipe(less({
				paths: config.less.paths.map(function(p){
					return path.resolve(__dirname, p);
				})
			}))
			.pipe(mobilizer('app.css', {
	      'app.css': {
	        hover: 'exclude',
	        screens: ['0px']
	      },
	      'hover.css': {
	        hover: 'only',
	        screens: ['0px']
	      }
			})),
		gulp.src(config.vendor.css.append)
	)
    .pipe($.cssmin())
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(path.join(config.dest, 'css')));
});

/*====================================================================
=                     Update and Copy config.xml                     =
====================================================================*/

gulp.task('phonegap-config', function() {
	return gulp.src('src/config.xml')
	.pipe($.replace('@@id', configProject.id))
	.pipe($.replace('@@version', config.version))
	.pipe($.replace('@@name', configProject.name))
	.pipe($.replace('@@description', configProject.description))
	.pipe(gulp.dest(config.dest));
});

/*====================================================================
=                     Copy locales                     =
====================================================================*/

gulp.task('locales', function() {
	return gulp.src('src/locales/**/*')
	.pipe(gulp.dest(path.join(config.dest, 'locales')));
});

/*====================================================================
=               Build Zip to submit to PhoneGap Build                =
====================================================================*/

gulp.task('build-zip', ['copy', 'pgbomit', 'copy-icon', 'copy-splash'], function () {
	var filename = project + "-" + env +"_rel-" + config.version + ".zip";
	return gulp.src('www/**/*')
		.pipe($.zip(filename))
		.pipe(gulp.dest('dist'));
});


/*====================================================================
=            Compile and minify js generating source maps            =
====================================================================*/
// - Orders ng deps automatically
// - Precompile templates to ng templateCache

gulp.task('js', function() {
	var app = configEnv.APP;
	var streamBuildAction = streamqueue({
		objectMode: true
	},
	gulp.src(config.vendor.js),
	gulp.src('src/js/services/meumobi-settings.js')  
	.pipe($.replace('@@APP', JSON.stringify(app)))
	.pipe($.replace('@@CONFIG', JSON.stringify(configProject.CONFIG))),
	//gulp.src('src/js/lib/pushwoosh-*.js')
	//.pipe($.replace('@@googleProjectNumber', configProject.CONFIG.PUSHWOOSH.googleProjectNumber))
	//.pipe($.replace('@@applicationCode', configProject.CONFIG.PUSHWOOSH.applicationCode)),
	gulp.src([
		'./src/js/**/*.js', 
		'!./src/js/services/meumobi-settings.js' 
		//'!./src/js/lib/pushwoosh-*.js'
	])
	.pipe($.replace('@@debug', config.debug))
	.pipe(ngFilesort()),
	gulp.src(['src/templates/**/*.html'])
	.pipe($.replace('@@name', configProject.name))
	.pipe(templateCache({
			module: 'infoMobi'
		}))
	);
	return streamBuildAction
	.pipe($.sourcemaps.init())
	.pipe($.concat('app.js'))
	.pipe($.ngAnnotate())
	.pipe($.if(!config.debug, $.stripDebug()))
	.pipe($.if(!config.debug, $.uglify({ mangle: false })))
	.pipe($.rename({suffix: '.min'}))
	.pipe($.sourcemaps.write('.'))
	.pipe(gulp.dest(path.join(config.dest, 'js')));
});


/*===================================================================
=            Watch for source changes and rebuild/reload            =
===================================================================*/

gulp.task('watch', function () {
  if (typeof config.server === 'object') {
    gulp.watch([config.dest + '/**/*'], ['livereload']);
  }
  gulp.watch(['./src/html/**/*'], ['html']);
  gulp.watch(['./src/less/**/*', './src/css/**/*'], ['less']);
  gulp.watch(['./src/js/**/*', './src/templates/**/*', config.vendor.js], ['js']);
  gulp.watch(['./src/images/**/*'], ['images']);
});


/*===================================================
=            Starts a Weinre Server                 =
===================================================*/

gulp.task('weinre', function() {
	if (typeof config.weinre === 'object') {
		var weinre = require('./node_modules/weinre/lib/weinre');
		weinre.run(config.weinre);
	} else {
		throw new Error('Weinre is not configured');
	}
});


/*======================================
=            Build Sequence            =
======================================*/
// phonegap-config allows to use phonegap CLI $ phonegap serve

gulp.task('build', function(done) {
	var tasks = ['html', 'fonts', 'images', 'less', 'js', 'locales', 'phonegap-config'];
	seq('clean', tasks, done);
});


/*====================================
=            Default Task            =
====================================*/

gulp.task('default', function(done) {
	var tasks = [];

	if (typeof config.weinre === 'object') {
		tasks.push('weinre');
	};

	if (typeof config.server === 'object') {
		tasks.push('connect');
	};

	tasks.push('watch');

	seq('build', tasks, done);
});

/*================================================================
=            Release Task to submit to PhoneGap Build            =
================================================================*/

gulp.task('release', function(done) {
	var tasks = [];

	if (typeof config.weinre === 'object' && config.debug) {
		tasks.push('weinre');
	};

	config.cordova = true;
	tasks.push('build-zip');

	seq('build', tasks, done);
});