(function() {
	'use strict';

	angular
	.module('infoMobi')
	.controller('ItemsShowController', ItemsShowController)
	.controller('ItemsListController', ItemsListController)

  function ItemsShowController(API, $rootScope, UtilsService, translateFilter, $log, $scope, $routeParams) {
    
  };

	function ItemsListController(API, $rootScope, UtilsService, translateFilter, $log, $scope, $routeParams, meuDialogs, $timeout) {

		var vm = this;
    
    vm.reload = reload;
    vm.loading = false;

    var cb_items = {
      success: function(response) {
        $log.debug('[ItemsListController]: cb_item.success');
        fulfill(response);
      },
      fail: function(response) {
        $log.debug('[ItemsListController]: cb_item.fail');
        $log.debug(response);
      }
    };
    
    function reload() {
      vm.loading = true;
      activate();
    }
    
    activate();

  	$rootScope.$on('loading:start', function() {
  		vm.loading = true;
  	})
    $rootScope.$on('loading:stop', function() {
  		vm.loading = false;
  	})

		function activate() {
      var category_id = $routeParams.id; 
      $timeout(activate, 12000);
      
      if (category_id) {
        API.Categories.items(
          category_id,
          {},//{order: 'start_date,DESC'},
          cb_items.success,
          cb_items.fail
        );
      } else {
        API.Items.latest(
          cb_items.success,
          cb_items.fail
        );
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

    function lookup(array) {
      var lookup = [];
      for (var i = 0, len = array.length; i < len; i++) {
          lookup[array[i]._id] = array[i];
      }
      return lookup;
    }
    
    function fulfill(response) {
      /*
        Update data if $rootScope.items is empty (1st load) or response is not unchanged (!fallback or !304)
      */
      var isFallback = response.hasOwnProperty('isFallback') ? response.isFallback : null;
      var unchanged = response.hasOwnProperty('unchanged') ? response.unchanged : null;
      $log.debug('fresh data? ' + !(unchanged || isFallback));
      
      if (!vm.hasOwnProperty('items') || !(unchanged || isFallback))
        updateDatas(response);
      // if we have a promise, we will use the same current function when it is fulfilled
      if (response.promise) {
        response.promise
        .then(function(response) {
          fulfill(response);
        })
        .catch(function(response) {
        })
      }
    }
    
    function updateDatas(response) {
      $log.debug('Update datas');
      if (response.data && response.data.items) {
        $log.debug('[ItemsListController]: updateDatas');
        var items = response.data.items;
        vm.items = items.map(function(e, index, arr) {
          return decorateItem(e, index, arr);
        });
				$rootScope.items = lookup(vm.items);
				// Remove cached polls from localstorage if fetch them from server
				localStorage.removeItem("polls");
      }
      vm.next = response._meta && response._meta.next;
      
      // if response.isFallback is true and !response.promise then an error occurs preventing update
      /*
        TODO: if online then toggle connectionStatus and display alert else if connectionStatus == offline don't show alert
      */
      if (response.isFallback && !response.promise) {
        meuDialogs.toast("Connection issue prevent syncing!");
      }
    }
	}
})();