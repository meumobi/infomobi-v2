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
					localStorage['newsList'] = JSON.stringify(data.items);
					callback(data.items, true);
				},
				function(error, status) {
					console.log(status);
					console.log("Request Failed:" + error);
					callback(error, false);
				}
			);
		},
		saveImage : function(imageUrl, id, callback){
			AppUtils.CanvasImg.createBase64Image(imageUrl,function(img64){
				localStorage['image_'+id] = img64;
				callback('image_'+id, img64);
			});
		},
		saveAllImages : function(){

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