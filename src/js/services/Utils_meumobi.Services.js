(function() {
	'use strict';

	angular
	.module('meumobi.services.Utils', ['meumobi.services.Cordova'])
	.factory('UtilsService', ['deviceReady', 'striptagsFilter', 'br2nlFilter', 'translateFilter', '$log', '$location', UtilsService]);

	function UtilsService(deviceReady, striptags, br2nl, translate, $log, $location) {
		var service = {};
		
		service.createBase64Image = createBase64Image;
		service.safeApply = safeApply;
		service.isOnline = isOnline;
		service.hideSplashScreen = hideSplashScreen;
		service.statusBar = statusBar;
		service.shareItem = shareItem;
		service.shareMedia = shareMedia;
		service.openMedia = openMedia;
		service.confirm = confirm;
		service.toast = toast;
		service.saveImage = saveImage;
		service.loadImage = loadImage;
		service.openInAppBrowser = openInAppBrowser;
		service.nativeFlipTransition = nativeFlipTransition;
		service.isCordovaApp = isCordovaApp;
 
		var spinner = {
			show: function () {
				deviceReady(function() {
					var spinner = window.plugins && window.plugins.spinnerDialog;
					if (spinner) {
						spinner.show();
					} else {
						// TODO: Browser fallback
						$log.debug("Spinnner.show");
					}
				});
			},
			hide: function () {
				deviceReady(function() {
					var spinner = window.plugins && window.plugins.spinnerDialog;
					if (spinner) {
						spinner.hide();
					} else {
						// TODO: Browser fallback
						$log.debug("Spinnner.hide");
					}
				});
			}
		};
		
		service.spinner = spinner; 
 
		return service;

		/* TODO: use a dynamic var for name of transition */
		
		function nativeFlipTransition(path) {
			var options = {
				"direction" : "right", // 'left|right|up|down', default 'left' (which is like 'next')
				"duration" : 350, // in milliseconds (ms), default 400
				"href" : path,
				"slowdownfactor": 3,
				"fixedPixelsTop": 50,
				"fixedPixelsBottom": 50,
			};

			deviceReady(function() {
				var nativepagetransitions = window.plugins && window.plugins.nativepagetransitions;
				if (nativepagetransitions) {
					nativepagetransitions.flip(options,
						function(msg) {
							$log.info("[nativeFlipTransition] Success: " + msg) // called when the animation has finished
						},
						function(msg) {
							$log.debug("[nativeFlipTransition]  Error: " + msg) // called in case you pass in weird values
						}
					);
				} else {
					$location.path(options.href.slice(1));
				}
			});
		}
		
		function openInAppBrowser(url, target, options) {
			deviceReady(function() {
				if (typeof cordova !== "undefined") {
					var iab = cordova && cordova.InAppBrowser.open;
					if (iab) {
						window.open = iab;
					}
				}
				/*
					The target in which to load the URL:
					_self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.
					_blank: Opens in the InAppBrowser.
					_system: Opens in the system's web browser.
				*/
				target = target || "_blank";
				options = options || "location=yes,enableViewportScale=yes";
				var ref = window.open(url, target, options);
				ref.addEventListener('loadstart', 
					function() {
						/* 
							Exists a default spinner on iOS but not for Android
							See: https://github.com/apache/cordova-plugin-inappbrowser/pull/89
						*/
						spinner.show();
					}, false);
				ref.addEventListener('loadstop', 
					function() {
						spinner.hide();
					}, false);
			})
		};
		
		function loadImage(url, placeholder) {
			var src = url;
			if (localStorage.hasOwnProperty(url)) {
				console.log("Load from localStorage: " + url);
				src = localStorage[url];
			} else if (placeholder != undefined) {
				console.log("Load from placeholder: " + placeholder);
				src = placeholder;
			} else {
				console.log("Load from Url");
			}
			return src;
		}

		function saveImage(path, domain) {
			console.log("Canvas: " + domain + path);
			//console.log(UtilsService);
			createBase64Image(domain+path, function(img64) {
				localStorage[path] = img64;
			});
		}

		function saveAllImages(imagesUrls, callback) {
			var imagesToSave = imagesUrls.length,
			totalImages = imagesToSave - 1;
			while (imagesToSave--) {
				//can't save all the images. the 5MB limit has been exceeded
				//app.saveImage(imagesUrls[imagesToSave],function(imageId, img64){
					//totalImages--;
					//if(imagesToSave == totalImages){
						callback();
						//}
						//});
					}
				}
		
				function deleteImages() {
					for (prop in localStorage) {
						if (prop.indexOf('image_') != -1) {
							delete localStorage[prop];
						}
					}
				}
		
		function createBase64Image(url, callback) {
			var img = new Image;
			img.setAttribute('crossOrigin', 'anonymous');
			img.onload = function() {
				imgToBase64(img, callback);
			}
			img.src = url;
		}
			
		function imgToBase64(img, callback) {
			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			console.log(img.width, img.height)
			canvas.getContext("2d").drawImage(img, 0, 0);
			var base64 = canvas.toDataURL('image/png');
			if (callback) {
				callback(base64);
			} else {
				return base64;
			}
		}
		
		function hideSplashScreen() {
			deviceReady(function() {
				if (navigator.splashscreen) {
					navigator.splashscreen.hide();
				}
			});
		}
		
		function statusBar() {
			deviceReady(function() {
				if (typeof StatusBar !== 'undefined') {
					StatusBar.overlaysWebView(false);
					StatusBar.styleLightContent();
					StatusBar.backgroundColorByName("black");	
				}
			});
		}
		
		function safeApply(scope, fn) {
			var phase = scope.$root.$$phase;
			if (phase == '$apply' || phase == '$digest') {
				if (fn && (typeof(fn) === 'function')) {
					fn();
				}
			} else {
				scope.$apply(fn);
			}
		}
		
		function networkState() {
			var networkState = navigator.connection.type;
			
			var states = {};
			
			states[Connection.UNKNOWN] = false;
			states[Connection.ETHERNET] = true;
			states[Connection.WIFI] = true;
			states[Connection.CELL_2G] = true;
			states[Connection.CELL_3G] = true;
			states[Connection.CELL_4G] = true;
			states[Connection.CELL] = true;
			states[Connection.NONE] = false;
			
			return states[networkState];
		}

		function isOnline(done) {
			deviceReady(function() {
				var connection = navigator.connection && navigator.connection.type;
				if (connection) {
					console.log("navigator.connection");
					done(networkState());
				} else {
					console.log("navigator.onLine");
					done(navigator.onLine);
				}
			})
		}
		
		function shareItem(item) {
			
			var options = {};
			// TODO: to use item.description use html tags and chars, if remove one or both the description will be unreadable, living them show html. Don't know any good solution then we I recommend to not share it (victor.dias)
			//message = message.replace(/(<([^>]+)>)/ig, "");
			options.message = item.title;
			options.subject = item.title;
			options.img = (item.thumbnails.length > 0) ? item.thumbnails[0].url : null;
			// TODO: test if we sharing works without link param
			options.link = item.hasOwnProperty("link") ? item.link : null;

			console.log(options);
			socialShare(options.message, options.subject, options.img, options.link);
		}

		function shareMedia(media) {

			var options = {};
			console.log(media);

			options.message = media.title;
			options.subject = media.title;
			options.img = null;
			options.link = media.url;
			
			// If media is saved locally (media.path) then share it
			// Else share its link (media.url)
			// Couldn't share together local pdf and link
			if (media.hasOwnProperty("path")) {
				options.img = media.path;
				options.link = null;
			} else if (media.thumbnails.length > 0) {
				options.img = media.thumbnails[0].url;
			}
			
			console.log(options);
			socialShare(options.message, options.subject, options.img, options.link);
		}
		
		function socialShare(message, subject, img, link) {
			deviceReady(function() {
				var social = window.plugins && window.plugins.socialsharing;
				if (social) {
					var postString = "; via #RIWeb_App";
					message += postString;
					subject += postString;
					social.share(message, subject, img, link);
				}
			});
		}

		// Get full path of file as param
		// ex: file:/storage/sdcard/DCIM/Camera/1404177327783.jpg
		function openMedia(media) {
			deviceReady(function() {
				var open = cordova.plugins.disusered.open;
				var path = null;

				var success = function(fileEntry) {
					$log.debug("window.resolveLocalFileSystemURL Success");
					$log.debug(fileEntry);
					open(fileEntry.nativeURL, function(e) {console.log(e)}, openError);
				}
				
				var error = function(e) {
					$log.debug(e);
					// TODO : disclaimer
				}
				
				var openError = function(code) {
					if (code === 1) {
						$log.debug('No file handler found');
					} else {
						$log.debug('Undefined error');
					}
				}
				window.resolveLocalFileSystemURL(media.path, success, error);
			});
		}

		function confirm(message, callback, title) {
			title = (title != undefined) ? title : 'Confirm';
			var callbacker = function (buttonIndex){
				var val = (buttonIndex == 1);
				callback(val);
			}
			if (navigator.notification) {
				
				navigator.notification.confirm(
					message,
					callbacker, //callback method...
					title
					//buttonLabels: Array of strings specifying button labels. (Array) (Optional, defaults to [OK,Cancel])
				);
			} else {
				var r = confirm(title);
				callback(r);
			}
		}
	
		function toast(message, success, fail) {
			deviceReady(function() {
				var toast = window.plugins && window.plugins.toast;
				if (toast) {
					toast.showLongBottom(message,
						function(resp) {
							if (success) {
								success(resp);
							}
						},
						function(err) {
							if (fail) {
								fail(err);
							}
						}
					);
				} else {
					alert(message);
				}
			});
		}
		
		/*
			http://damien.antipa.at/blog/2014/02/08/3-ways-to-detect-that-your-application-is-running-in-cordova-slash-phonegap/
		*/
		function isCordovaApp() {
			var isCordovaApp = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
			$log.debug("isCordovaApp ? " + isCordovaApp);
			return isCordovaApp;
		}
	}
})();
