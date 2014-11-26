'use strict';

angular.module('meumobi.sync', ['meumobi.api','meumobi.app'])

.factory('SyncNews', function(Items,AppInfo) {
	
	var app = {
		get : function(callback){
			if(AppInfo.Device.isOnline()){
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
		}
	};
	return app;

});




var CanvasImg = (function(){
    return{
        createBase64Image : function(url,callback){
            var img = new Image;
            img.onload = function(){
                CanvasImg.imgToBase64(img,callback);
            }
            img.src = url;
        },
        imgToBase64 : function(img,callback){
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext("2d").drawImage(img,0,0);
            var base64 = canvas.toDataURL();
            if(callback){
                callback(base64);
            }else{
                return base64;
            }
        }
    }
})();
