angular
  .module('meumobi.services.Files', [])
  .provider('Files', function() {
    var fileTransfers = {};
    var files = {};
    var config = {
      path: '/Downloads/rimobi'
    }

    /**
     * setup service
     */
    this.setup = function(params) {
      angular.extend(config, params);
    };

    this.$get = function($q, $rootScope, MEDIAS) {
      var api = {};
      var service = {};
      var localDir;
      /**
       *Api methods, available only on the inside the service
       */
      api.getLocalDir = function() {
        if (localDir) return localDir;
        if (device.platform.toLowerCase() == 'android') {
          localDir = cordova.file.externalRootDirectory + config.path;
        } else {
          localDir = cordova.file.documentsDirectory;
        }
        return localDir;
      }
      api.getLocalPath = function(fileName) {
          return api.getLocalDir() + '/' + fileName;
        }
        //get localstorage list
      api.files = function() {
          if (!Object.keys(files).length && localStorage['files'])
            files = JSON.parse(localStorage['files']);
          return files;
        }
        //add file to localstorage
      api.addFile = function(id, file) {
        files[id] = file;
        localStorage['files'] = JSON.stringify(files);
      };
      //remove file from localstorage
      api.removeFile = function(id) {
        delete files[id];
        localStorage['files'] = JSON.stringify(files);
      };
      //get files handler
      api.loadFile = function(path) {
        var deferred = $q.defer();
        window.resolveLocalFileSystemURL(path, function(entry) {
            deferred.resolve(entry);
          },
          function(error) {
            deferred.reject(error);
          });
        return deferred.promise;
      };
      api.isDownloaded = function(fileName) {
        return !!api.files()[fileName];
      };
      api.isDownloading = function(fileName) {
        return !!fileTransfers[fileName];
      };

      /**
       * Service methods, that are public and available for any resource
       */
      // File available statuses, best for debug and maitain than just string.
      return {
        statuses: {
          download: 'download',
          downloading: 'downloading',
          downloaded: 'downloaded',
          open_by_link: 'open_by_link'
        },
        download: function(file) {
          var deferred = $q.defer();
          var fileName = this.fileName(file);
          var uri = encodeURI(file.url);
          var statuses = this.statuses;
          var fileTransfer = new FileTransfer();
          //update file status
          file.status = statuses.downloading;

          fileTransfers[fileName] = fileTransfer;
          fileTransfer.onprogress = function(e) {
            $rootScope.$emit(fileName + '.progress', e);
          };
          /**
           * Download file to local folder.
           */
          fileTransfer.download(uri, api.getLocalPath(fileName), function(entry) {
            console.log(JSON.stringify(entry));
            file.path = entry.nativeURL;
            api.addFile(fileName, {
              title: file.title,
              type: file.type,
              length: file.length,
              path: entry.nativeURL
            });
            delete fileTransfers[fileName];
            file.status = statuses.downloaded;
            $rootScope.$emit(fileName + '.finish', file);
            deferred.resolve(file);
          }, function(error) {
            console.log(JSON.stringify(error));
            delete fileTransfers[fileName];
            $rootScope.$emit(fileName + 'error', error);
            deferred.reject(error);
          }, false);
          return deferred.promise;
        },
        fileName: function(file) {
          return md5(file.title) + '.' + MEDIAS[file.type].extension;
        },
        list: function() {
          return api.files();
        },
        getStatus: function(fileName) {
          //get the correct file status
          if (api.isDownloaded(fileName)) {
            return this.statuses.downloaded;
          } else if (api.isDownloading(fileName)) {
            return this.statuses.downloading;
          }
          return this.statuses.download;
        },
        get: function(file) {
          var fileName = this.fileName(file);
          var status = this.getStatus(fileName);
          //load file from localstorage if needed
          if (status == this.statuses.downloaded && !file.path) {
            file.path = api.files()[fileName].path;
          }
          file.status = status;
          return file;
        },
        open: function(file) {
          var target = '_blank';
          if (device.platform.toLowerCase() != 'ios') {
            target = '_system';
          }
          window.open(file.path, target, 'location=no,enableViewportScale=yes');
        },
        remove: function(file) {
          var deferred = $q.defer();
          var fileName = this.fileName(file);
          var statuses = this.statuses;
          api.loadFile(file.path).then(function(entry) {
            entry.remove(function(status) {
              console.log('File removed!');
              api.removeFile(fileName);
              delete file.path;
              file.status = statuses.download;
              deferred.resolve(file);
            }, function(error) {
              console.log('error deleting the file ' + error.code);
              deferred.reject(error);
            }, function(error) {
              console.log('file does not exist');
              deferred.reject(error);
            });
          }, function() {
            //file not exists,
            api.removeFile(fileName);
            deferred.resolve();
          });
          return deferred.promise;
        }
      }; //end return
    };
  });
