(function() {
	'use strict';

	angular
	.module('ngMeumobi.Entities.devices', [])
  .factory('Devices', Devices)

  function Devices($log, $q, $exceptionHandler, meuCordova, meuUtils, meuCloud) {
    
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
      return meuCordova.device.getUUID()
        .then(function (uuid) {
          properties.uuid = uuid;
          return meuCordova.device.getInformations();
        })
        .then(function (infos) {
          angular.merge(properties, infos);
          $log.debug('After getInformations');
          $log.debug(properties);
          return meuCordova.device.getAppVersion().catch(function (e) {
              // Not a critical error, continue chain
            $log.debug('After getAppVersion catch');
            $log.debug(properties);
            return $q.resolve();
          });
        })
        .then(function (app) {
          angular.merge(properties, app);
          $log.debug('After getAppVersion resolve');
          $log.debug(properties);
          return $q.resolve();
        })
        .catch(function(e) {
          $log.debug('Failed to get Device Properties');
          return $q.reject(e);
          /* potentially some code for generating an error specific message here */
        });        
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
          meuCloud.API.Devices.save(properties)
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