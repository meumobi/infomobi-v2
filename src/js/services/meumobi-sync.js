'use strict';

angular.module('meumobi.sync', ['meumobi.api','meumobi.app','meumobi.utils'])

.factory('SyncNews', function(Items,AppInfo, AppUtils) {
	
	var app = {
		get : function(callback){
			if(AppInfo.service.Device.isOnline() && !localStorage.hasOwnProperty('newsList')){
				app.list(callback)
			}else if(localStorage.hasOwnProperty('newsList')){
				var news = JSON.parse(localStorage['newsList']);
				callback(news, true);
			}else{
				callback([], true);
			}
		},
		list : function(callback){
			Items.latest(
				function(data) {
					var news = data.items;
					//var imagesUrls = app.getImagesFromNews(news);
					//app.saveAllImages(imagesUrls,function(){
						localStorage['newsList'] = JSON.stringify(news);
						callback(news, true);	
					//});
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
		saveImage : function(image, id, callback){console.log(AppUtils)
			AppUtils.CanvasImg.createBase64Image(image.url,function(img64){
				localStorage['image_'+image.id] = img64;
				callback('image_'+image.id, img64);
			});
		},
		saveAllImages : function(imagesUrls, callback){
			var totalImages = imagesUrls.length,
			imagesToSave = totalImages;
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