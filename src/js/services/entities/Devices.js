(function() {
	'use strict';

	angular
	.module('ngMeumobi.Entities.devices', [])
  .factory('Devices', Devices)

  function Devices($log, $q, $exceptionHandler, meuDevice, API) {
    
		var service = {};
    var properties = {};
    
    service.save = save;
    service.setProperties = setProperties;
    service.setProperty = setProperty;

		return service;
    
    function setProperties(props) {
        angular.extend(properties, props);
    };

    function setProperty(name, value) {
        properties[name] = value;
    };
    
    function getProperties() { 
      return meuDevice.getUUID()
        .then(function (uuid) {
          properties.uuid = uuid;
          return meuDevice.getInformations();
        })
        .then(function (infos) {
          angular.merge(properties, infos);
          return meuDevice.getAppVersion().catch(function (e) {
              // Not a critical error, continue chain
            return $q.resolve();
          });
        })
        .then(function (app) {
          angular.merge(properties, app);
          $log.debug('merge');
          return $q.resolve();
        })
        .catch(function(e) {
          $log.debug('Failed to get Device Properties');
          return $q.reject(e);
          /* potentially some code for generating an error specific message here */
        });
    }
    
    function sendToApi(device) {

      return $q(function (resolve, reject) {
  			var cb_devices = {
  				save: {
  					success: function(response) {
  						$log.debug('Device successfuly sent to API');
  						resolve(response);
  					},
  					error: function(response) {
              $log.debug('Failed to send Device to API');
  						reject(response);
  					}
  				}
  			};
        API.Devices.save(device, cb_devices.save.success, cb_devices.save.error);
      })
    }
    
    function save() {
      
      return $q(function (resolve, reject) {
        getProperties()
        .then(function() {
    			/*
    				Save it to identify first connection: if localStorage.device NOT exists then 1st connection is true
    			*/
          localStorage.device = JSON.stringify(properties);
          if (!properties.hasOwnProperty('uuid'))
            throw new Error('Missing UUID');
          sendToApi(properties)
          .then(function(response) {
            resolve(response);
          })
          .catch(function(e) {
            $exceptionHandler(e);
            reject(e);
          });
        })
        .catch(function(e) {
          $exceptionHandler();
          reject(e);
        })
      })
    }
  };
})();