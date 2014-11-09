'use strict';

(function () {
	var scrollItems = [
		{
			thumbnail: "http://www.siemens.com/pool/newselement/br/siemens-in-brazil.jpg",
			description: "No Brasil, atualmente contamos com aproximadamente 8 mil colaboradores, 13 fábricas e 7 centros de P&D. Assista ao vídeo e conheça tudo que a Siemens pode oferecer nas áreas de Automação, digitalização e eletrificação.",
			title: "A presença da Siemens no Brasil",
			pubdate: "22 de setembro, 2014",
			id: "1"
		},
		{
			thumbnail: "http://www.siemens.com/pool/newselement/br/dow-jones-sustainability-index_268x130.jpg",
			description: "A Siemens é a empresa mais sustentável no setor industrial, de acordo com o Índice de Dow Jones de Sustentabilidade (Dow Jones Sustainability Index – DJSI). A Siemens ficou em primeiro lugar dentre as empresas do setor Bens de Capital do ranking que reúne cerca de 350 empresas com melhores práticas de sustentabilidade em todo o mundo em sete setores de atividade econômica.",
			title: "Siemens lidera o ranking do Índice Dow Jones de Sustentabilidade",
			pubdate: "09 de setembro, 2014",
			id: "2"
		},
		{
			thumbnail: "http://www.siemens.com/pool/newselement/br/siemens-brazil-our-commitment-to-integrity_268x130.jpg",
			description: "Desde 2007, a Siemens tem consistentemente aplicado um rigoroso sistema de transparência e integridade (conhecido internacionalmente como Sistema de Compliance). Este sistema visa a garantir o atendimento a normas, códigos, leis e procedimentos, a fim de combater desvios e fraudes organizacionais, oferecendo maior transparência aos seus acionistas e tornando-se referência mundial em ética nos negócios. O compromisso da Siemens contra más condutas não se refere somente ao presente e ao futuro, mas também ao passado.",
			title: "Nosso Compromisso com a Integridade",
			pubdate: "09 de setembro, 2014",
			id: "3"
		}
	],

    findById = function (id) {
        var item = null,
            l = scrollItems.length,
            i;
        for (i = 0; i < l; i = i + 1) {
            if (scrollItems[i].id === id) {
                item = scrollItems[i];
                break;
            }
        }
        return item;
    };

	angular.module('meumobi.stubs', [])

	.factory('Items', 
		function () {
			return {
				latest: function () {
					return {items: scrollItems};
				},
				get: function (item) {
					return findById(parseInt(item.id));
				}
		}
	})
}());

