'use strict';

angular.module('meumobi.sync', ['meumobi.api','meumobi.app','meumobi.utils'])

.factory('SyncNews', function(Items,AppInfo, AppUtils) {
	
	var app = {
		get : function(callback){
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
			Items.latest(
				function(data,a,b) {console.log(data,a,b)
					var news = data.items;
					var imagesUrls = app.getImagesFromNews(news);
					app.saveAllImages(imagesUrls,function(){
						localStorage['newsList'] = JSON.stringify(news);
						callback(news, true);	
					});
				},
				function(error, status) {
					console.log(status);
					console.log("Request Failed:" + error);
					callback(error, false);
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
						url : "http://int-meumobi.com/"+img.path,
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
				app.saveImage(imagesUrls[imagesToSave],function(imageId, img64){
					totalImages--;
					if(imagesToSave == totalImages){
						callback();
					}
				});
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