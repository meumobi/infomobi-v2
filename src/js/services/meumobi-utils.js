'use strict';

angular.module('meumobi.utils', [])

.factory('AppUtils', function() {
	var app = {
		CanvasImg : {
	        createBase64Image : function(url,callback){
	            var img = new Image;
	            img.crossorigin="anonymous"
	            img.onload = function(){
	                app.CanvasImg.imgToBase64(img,callback);
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
	};
	
	

	return app;
})
