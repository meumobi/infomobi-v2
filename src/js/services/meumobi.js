angular.module('infoboxApp.services.Meumobi', [])

.factory('Articles', function($http) {
	var factory = {};
	factory.get = function(){
		var url = 'http://mobi.comunique-se.com.br/api/infobox.int-meumobilesite.com/categories/277/items';
		return $http.get(url, {cache: true, timeout: 2000}).then( function(response){
			console.log(response.data.items);
			return response.data;
		})
	},
	factory.find = function(article){
		var url = 'http://meumobi.com/api/180back.meumobi.com/items/'+article.articleId;
		return $http.get(url, {cache: true, timeout: 2000}).then( function(response){
			console.log(response.data.items);
			return response.data;
		})
	}
	return factory;
});