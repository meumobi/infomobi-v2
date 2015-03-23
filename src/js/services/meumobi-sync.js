'use strict';

angular.module('meumobi.sync', ['meumobi.api','meumobi.appInfo', 'meumobi.utils', 'meumobi.settings'])

.factory('SyncNews', function(API,AppInfo, AppUtils, $rootScope, SITE) {

	var app = {
		get : function(callback){
		var push = window.plugins.pushNotification;
		push.setApplicationIconBadgeNumber(0);

		if(!localStorage.hasOwnProperty('newsList')){
				if(!AppInfo.service.Device.isOnline()){
					callback([],true);
					return false;
				}
			}else{
				var news = JSON.parse(localStorage['newsList']);
				callback(news, true);
			}
			if(AppInfo.service.Device.isOnline()){
				app.list(callback);
			}
		},
		list : function(callback){
			API.Items.latest(
				function(data) {
					var news = data.items;
					var imagesUrls = app.getImagesFromNews(news);
					app.deleteImages();
					app.saveAllImages(imagesUrls,function(){
						localStorage['newsList'] = JSON.stringify(news);
						$rootScope.newsList = news;
						callback(news, true);
					});
				},
				function(error, status) {
					console.log(status);
					console.log("Request Failed:" + error);
					callback(error, false);
					$rootScope.loading = false;
				}
			);
		},
		getImagesFromNews : function(news){
			var images = [],
			newsLength = news.length;
			while(newsLength--){
				var atualNews = news[newsLength];
				for(var i = 0, totalImages = atualNews.images.length; i < totalImages; i++){
					var img = atualNews.images[i];
					images.push({
						url : SITE.SRC_URL+img.path,
						id : img.id
					});
				}
			}
			return images;
		},
		saveImage : function(image, callback){console.log(AppUtils)
			AppUtils.CanvasImg.createBase64Image(image.url,function(img64){
				localStorage['image_'+image.id] = img64;
				callback('image_'+image.id, img64);
			});
		},
		saveAllImages : function(imagesUrls, callback){
			var imagesToSave = imagesUrls.length,
			totalImages = imagesToSave-1;
			while(imagesToSave--){
				//can't save all the images. the 5MB limit has been exceeded
				//app.saveImage(imagesUrls[imagesToSave],function(imageId, img64){
					//totalImages--;
					//if(imagesToSave == totalImages){
						callback();
					//}
				//});
			}

		},
		deleteImages : function(){
			for( prop in localStorage ){
			   if(prop.indexOf('image_')!=-1){
			   		delete localStorage[prop];
			   }
			}
		}
	};
	return app;

});
