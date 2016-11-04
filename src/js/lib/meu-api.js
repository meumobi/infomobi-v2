/*! meu-api.js
   Copyright 2011-2016 Victor DIAS

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/*jslint browser:true*/
/*global console,define,module*/


var MeuAPI = {
  version: '1.0.0',
  options: {
    debug: false, /* call the log method ? */
  },
  overridables: {
    log: function (str, level) {
            'use strict';
            if (MeuAPI.options.debug) {
                if (level === LOG_LEVEL_INFO) { str = 'INFO: ' + str; }
                if (level === LOG_LEVEL_WARNING) { str = 'WARN: ' + str; }
                if (level === LOG_LEVEL_ERROR) { str = 'ERROR: ' + str; }
                console.log(str);
            }
    }
  },
  attributes: {}
};

(function () {

  'use strict';

/*
  Helpers
*/
  var Helpers = {};
       
  Helpers.hasAngularJS = function() {
    return MeuAPI.AngularJS;
  }
  
  Helpers.lookup = function(array) {
    var lookup = [];
    for (var i = 0, len = array.length; i < len; i++) {
        lookup[array[i].id] = array[i];
    }
    return lookup;
  }

/*
  Private
*/
  
  var Private = { attributes: {} };

  Private.isMeuAPILoaded = function () {
      if (!MeuAPI.attributes.filesystem || !MeuAPI.attributes.dirEntry) {
          MeuAPI.overridables.log('MeuAPI not loaded yet! - Have you called MeuAPI.init() first?', LOG_LEVEL_WARNING);
          return false;
      }
      return true;
  };
  Private.attributes.hasLocalStorage = false;
  Private.hasLocalStorage = function () {
      // if already tested, avoid doing the check again
      if (Private.attributes.hasLocalStorage) {
          return Private.attributes.hasLocalStorage;
      }
      try {
          var mod = 'meuapi_test';
          localStorage.setItem(mod, mod);
          localStorage.removeItem(mod);
          Private.attributes.hasLocalStorage = true;
          return true;

      } catch (e) {
          // this is an info, not an error
          MeuAPI.overridables.log('Could not write to local storage: ' + e.message, LOG_LEVEL_INFO);
          return false;
      }
  };
  
/****************************************************************************/    

  MeuAPI.init = function (success_callback, error_callback) {
    MeuAPI.AngularJS = typeof window.angular !== 'undefined' ? true : false; // is AngularJS
    success_callback();
  }
  
  MeuAPI.getCategory = function(id) {
    return MeuAPI.attributes.categories[id];
  }
  
  MeuAPI.getCategories = function() {
    return MeuAPI.attributes.categories;
  }
  
  MeuAPI.setCategories = function(categories) {
    MeuAPI.attributes.categories = Helpers.lookup(categories);
  }

	MeuAPI.attributes = {
    cdnURl: "",
    apiURl: "",
    domains: "",
    language: "",
    currentItem: "",
    categories: []
  }; 
  
 /*
 Items.nextPage // Replace meumobiSite.apiFullPathRequest(
  "_meta":{"next":"/api/bioseven.mobi.comunique-se.com.br/categories/514/items?category=514&limit=12&page=2"}
 */
  
  MeuAPI.helpers = Helpers;

/****************************************************************************/

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define('meuapi', [], function () {
            return MeuAPI;
        });
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = MeuAPI;
    }
    else {
        window.MeuAPI = MeuAPI;
    }

})(window.angular || function () { throw "AngularJS is not available"; });