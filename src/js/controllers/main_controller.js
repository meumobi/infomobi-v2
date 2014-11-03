'use strict';

angular.module('infoboxApp.controllers.Main', [])

.controller('MainController', function($rootScope, $scope, analytics, $location){

	$rootScope.$on("$routeChangeStart", function(){
		$rootScope.loading = true;
	});

	$rootScope.$on("$routeChangeSuccess", function(){
		$rootScope.loading = false;
	});


	var scrollItems = [];

	for (var i=1; i<=10; i++) {
	scrollItems.push({
		img: "http://www.siemens.com/pool/newselement/br/siemens-in-brazil.jpg",
		caption: "No Brasil, atualmente contamos com aproximadamente 8 mil colaboradores, 13 fábricas e 7 centros de P&D. Assista ao vídeo e conheça tudo que a Siemens pode oferecer nas áreas de Automação, digitalização e eletrificação.",
		title: "A presença da Siemens no Brasil",
		published: "22 de setembro, 2014"
	});
	scrollItems.push({
			img: "http://www.siemens.com/pool/newselement/br/dow-jones-sustainability-index_268x130.jpg",
			caption: "A Siemens é a empresa mais sustentável no setor industrial, de acordo com o Índice de Dow Jones de Sustentabilidade (Dow Jones Sustainability Index – DJSI). A Siemens ficou em primeiro lugar dentre as empresas do setor Bens de Capital do ranking que reúne cerca de 350 empresas com melhores práticas de sustentabilidade em todo o mundo em sete setores de atividade econômica.",
			title: "Siemens lidera o ranking do Índice Dow Jones de Sustentabilidade",
			published: "09 de setembro, 2014"
		});
	scrollItems.push({
			img: "http://www.siemens.com/pool/newselement/br/siemens-brazil-our-commitment-to-integrity_268x130.jpg",
			caption: "Desde 2007, a Siemens tem consistentemente aplicado um rigoroso sistema de transparência e integridade (conhecido internacionalmente como Sistema de Compliance). Este sistema visa a garantir o atendimento a normas, códigos, leis e procedimentos, a fim de combater desvios e fraudes organizacionais, oferecendo maior transparência aos seus acionistas e tornando-se referência mundial em ética nos negócios. O compromisso da Siemens contra más condutas não se refere somente ao presente e ao futuro, mas também ao passado.",
			title: "Nosso Compromisso com a Integridade",
			published: "09 de setembro, 2014"
		});
	}

	$scope.scrollItems = scrollItems;


	$scope.userAgent =  navigator.userAgent;
	
	$scope.mailto = function(e) {
		if (window.plugins && window.plugins.emailComposer) {
			window.plugins.emailComposer.showEmailComposerWithCallback(console.log("Email callback " + e), "Want to know more about infoBox...", "Please send me more details.", ["infobox@siemens.com.br"], null, null, false, null, null);
		} else {
			location.href = 'mailto:infobox@siemens.com.br?subject=Question about media infoBox&body=';
		}
	}

	$scope.NavBars = {
		visibility : function(){console.log($location.url())
			if($location.url() != "/login"){
				return true;
			}
			return false;
		}
	}
	
});

