(function() {
	'use strict';

	angular
	.module('infoMobi')
	.controller('ItemsShowController', ItemsShowController)
	.controller('ItemsListController', ItemsListController)

  function ItemsShowController($rootScope, UtilsService, translateFilter, $log, $scope, $routeParams) {
    
  };

	function ItemsListController($rootScope, UtilsService, translateFilter, $log, $scope, $routeParams, meuCordova, meuCloud, $timeout, SharedState, $exceptionHandler) {

		var vm = this;
    
    vm.loading = false;
    
    activate();

  	$rootScope.$on('loading:start', function() {
  		vm.loading = true;
  	})
    $rootScope.$on('loading:stop', function() {
  		vm.loading = false;
  	})

		function activate() {
      $log.debug('ItemsListController: activate');
      var category_id = $routeParams.id; 
  
      var promise = $timeout(activate, 25000);

      // Listen for the $destroy event to halt activate, when starting new controller for example
      $scope.$on('$destroy', function(){
          $timeout.cancel(promise);
      });
      
      if (category_id) {
        meuCloud.API.Categories.items(
          category_id,
          {}//{order: 'start_date,DESC'}
        )
        .then(function(response) {
          updateDatas(response);
          if (response.promise)
            return response.promise;
        })
        // If response contains a promise, means is from cache and promise will sync w/ Server
        .then(function(response) {
          updateDatas(response)
        })
        .catch(function(e) {
          $exceptionHandler(e);
        })
      } else {
        meuCloud.API.Items.latest()
        .then(function(response) {
          updateDatas(response);
          if (response.promise)
            return response.promise;
        })
        // If response contains a promise, means is from cache and promise will sync w/ Server
        .then(function(response) {
          updateDatas(response)
        })
        .catch(function(e) {
          $exceptionHandler(e);
        })
      }
		}

    function decorateItem(item, index, items) {
      // Add next and previous attributes for swipe navigation on /items/show
      if (items.length-1 > index)
        item.next = "/" + items[index+1].type + "/show/" + items[index+1]._id;
      if (index != 0)
        item.previous = "/" + items[index-1].type + "/show/" + items[index-1]._id;
      
      return item;
    }
    
    function updateDatas(response) {
      /*
        Update data if $rootScope.items is empty (1st load) or response is not unchanged (!fallback or !304)
      */
      $log.debug('fresh data? ' + meuCloud.helpers.isFreshResponse(response));
      if (!vm.hasOwnProperty('items') || meuCloud.helpers.isFreshResponse(response)) {
        if (response.data && response.data.items) {
          $log.debug('[ItemsListController]: updateDatas');
          var items = response.data.items;
          vm.items = items.map(function(e, index, arr) {
            return decorateItem(e, index, arr);
          });
  				$rootScope.items = meuCloud.helpers.lookup(vm.items);
  				// Remove cached polls from localstorage if fetch them from server
  				localStorage.removeItem("polls");
        }
        vm.next = response._meta && response._meta.next;
      
        // if response.isFallback is true and !response.promise then an error occurs preventing update
        /*
          TODO: if online then toggle connectionStatus and display alert else if connectionStatus == offline don't show alert
        */
        if (response.isFallback && !response.promise) {
          meuCordova.dialogs.toast("Connection issue prevent syncing!");
        }        
      }
    }
	}
})();