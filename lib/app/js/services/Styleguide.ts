/*
 * Styleguide.ts
 *
 * Handles styleguide data
 */

/// <reference path="../interfaces.d.ts" />

interface ResponseData {
  config: any;
  variables: any;
  sections: any;
}

angular.module('sgApp')
  .service('Styleguide', ['$http', '$rootScope', 'Socket', 'debounce', 
    function($http: angular.IHttpService, 
             $rootScope: angular.IRootScopeService, 
             Socket: any, 
             debounce: (wait: number, fn: Function) => Function): StyleguideService {

      const _this: StyleguideService = this;

      this.sections = {};
      this.config = {};
      this.variables = {};
      this.status = {
        hasError: false,
        error: {},
        errType: ''
      };

      this.get = function(): angular.IPromise<void> {
        return $http({
          method: 'GET',
          url: 'styleguide.json'
        }).then(function(response: angular.IHttpResponse<ResponseData>) {
          _this.config.data = response.data.config;
          _this.variables.data = response.data.variables;
          _this.sections.data = response.data.sections;

          if (!Socket.isConnected()) {
            Socket.connect();
          }
        });
      };

      this.refresh = debounce(800, function() {
        _this.get();
      });

      Socket.on('styleguide compile error', function(err: any) {
        _this.status.hasError = true;
        _this.status.error = err;
        _this.status.errType = 'compile';
      });

      Socket.on('styleguide validation error', function(err: any) {
        _this.status.hasError = true;
        _this.status.error = err;
        _this.status.errType = 'validation';
      });

      Socket.on('styleguide compile success', function() {
        _this.status.hasError = false;
      });

      $rootScope.$on('styles changed', function() {
        _this.refresh();
      });

      $rootScope.$on('progress end', function() {
        _this.refresh();
      });

      // Get initial data
      this.get();

      return this;
    }
  ]);
