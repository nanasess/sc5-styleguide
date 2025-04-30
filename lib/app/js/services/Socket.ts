/*
 * Socket.ts
 *
 * Handles socket.io connections
 */

// Socket service interface
interface SocketService {
  isAvailable(): boolean;
  on(eventName: string, listener: Function): void;
  emit(eventName: string, data?: any, callback?: Function): void;
  isConnected(): boolean;
  connect(): void;
}

// Socket event listener interface
interface SocketEventListener {
  event: string;
  listener: Function;
}

angular.module('sgApp')
  .service('Socket', ['$rootScope', '$window', 
    function($rootScope: angular.IRootScopeService, 
             $window: angular.IWindowService): SocketService {

    'use strict';

    let socket: any;
    let connected: boolean = false;
    const deferredEventListeners: SocketEventListener[] = [];
    
    const service: SocketService = {
      isAvailable: function(): boolean {
        return (typeof $window.io !== 'undefined');
      },
      on: function(eventName: string, listener: Function): void {
        const fn = function() {
          const args = arguments;
          $rootScope.$apply(function() {
            listener.apply(undefined, args);
          });
        };

        deferredEventListeners.push({
          event: eventName,
          listener: fn
        });

        if (this.isConnected()) {
          socket.on(eventName, fn);
        }
      },
      emit: function(eventName: string, data?: any, callback?: Function): void {
        if (socket) {
          socket.emit(eventName, data, function() {
            const args = arguments;
            $rootScope.$apply(function() {
              if (callback) {
                callback.apply(undefined, args);
              }
            });
          });
        }
      },
      isConnected: function(): boolean {
        return socket !== undefined && connected === true;
      },
      connect: connect
    };

    function connect(): void {
      if (service.isAvailable()) {
        if (connected) {
          socket.disconnect();
        }

        socket = $window.io.connect();

        deferredEventListeners.forEach(function(deferred: SocketEventListener) {
          socket.on(deferred.event, deferred.listener);
        });
      }
    }

    service.on('connect', function() {
      connected = true;
      $rootScope.$broadcast('socket connected');
    });

    service.on('disconnect', function() {
      connected = false;
      $rootScope.$broadcast('socket disconnected');
    });

    service.on('error', function(err: any) {
      $rootScope.$broadcast('socket error', err);
    });

    return service;
  }]);
