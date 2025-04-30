'use strict';

interface AppControllerScope extends ng.IScope {
  // このインターフェースはコントローラで使用する$scopeの型を定義します
  // 必要に応じてプロパティを追加
}

// ngProgress定義
interface NgProgress {
  start: () => void;
  complete: () => void;
  reset: () => void;
  setHeight: (height: string) => void;
  setColor: (color: string) => void;
}

interface NgProgressFactory {
  createInstance: () => NgProgress;
}

angular.module('sgApp')
  .controller('AppCtrl', ['$scope', 'ngProgressFactory',
    function($scope: AppControllerScope, ngProgressFactory: NgProgressFactory) {
      var ngProgress: NgProgress = ngProgressFactory.createInstance();
      // ngProgress do not respect styles assigned via CSS if we do not pass empty parameters
      // See: https://github.com/VictorBjelkholm/ngProgress/issues/33
      ngProgress.setHeight('');
      ngProgress.setColor('');

      $scope.$on('progress start', function() {
        ngProgress.start();
      });

      $scope.$on('progress end', function() {
        ngProgress.complete();
      });

      // Reload styles when server notifies about the changes
      // Add cache buster to every stylesheet on the page forcing them to reload
      $scope.$on('styles changed', function() {
        var links: HTMLLinkElement[] = Array.prototype.slice.call(document.getElementsByTagName('link'));
        links.forEach(function(link: HTMLLinkElement) {
          if (typeof link === 'object' && link.getAttribute('type') === 'text/css' && link.getAttribute('data-noreload') === null) {
            link.href = link.href.split('?')[0] + '?id=' + new Date().getTime();
          }
        });
      });

      $scope.$on('socket connected', function() {
        console.log('Socket connection established');
      });

      $scope.$on('socket disconnected', function() {
        console.error('Socket connection dropped');
        ngProgress.reset();
      });

      $scope.$on('socket error', function(err: any) {
        console.error('Socket error:', err);
      });

    }]);
