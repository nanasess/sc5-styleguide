'use strict';

/// <reference path="./interfaces.d.ts" />

// 依存モジュールを定義
const deps_modules: string[] = [
  'ui.router',
  'ngAnimate',
  'colorpicker.module',
  'hljs',
  'LocalStorageModule',
  'oc.lazyLoad',
  'ngProgress',
  'rt.debounce',
  'duScroll'
];

// 追加の依存モジュールがあれば追加
if (window['_styleguideConfig'] &&
    window['_styleguideConfig'].additionalNgDependencies &&
    window['_styleguideConfig'].additionalNgDependencies.length &&
    window['_styleguideConfig'].additionalNgDependencies.length > 0) {
  deps_modules.push(...window['_styleguideConfig'].additionalNgDependencies);
  console.info('Merging dependencies: ' + deps_modules);
}

// モジュール定義
angular.module('sgApp', deps_modules)
  .value('duScrollOffset', 30)
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'localStorageServiceProvider', '$ocLazyLoadProvider',
    function($stateProvider: any, 
             $urlRouterProvider: any, 
             $locationProvider: any, 
             localStorageServiceProvider: any, 
             $ocLazyLoadProvider: any): void {
      
      const styleguideConfig: any = {};
      if (typeof window['_styleguideConfig'] !== 'undefined') {
        Object.assign(styleguideConfig, window['_styleguideConfig']);
      }
      
      $urlRouterProvider.otherwise('/');
      $stateProvider
        .state('app', {
          template: '<ui-view />',
          controller: 'AppCtrl',
          abstract: true
        })
        .state('app.index', {
          templateUrl: 'views/main.html',
          controller: 'MainCtrl'
        })
        .state('app.index.section', {
          url: '/section/:section',
          templateUrl: 'views/sections.html',
          controller: 'SectionsCtrl',
          viewClass: 'view-section',
          resolve: {
            loadLazyModule: ['$$animateJs', '$ocLazyLoad', function($$animateJs: any, $ocLazyLoad: any): any {
              return loadModule($$animateJs, $ocLazyLoad);
            }]
          }
        })
        .state('app.index.search', {
          url: '/search/:section',
          templateUrl: 'views/sections.html',
          controller: 'SectionsCtrl',
          resolve: {
            loadLazyModule: ['$$animateJs', '$ocLazyLoad', function($$animateJs: any, $ocLazyLoad: any): any {
              return loadModule($$animateJs, $ocLazyLoad);
            }]
          }
        })
        .state('app.index.overview', {
          url: '/',
          templateUrl: 'overview.html',
          viewClass: 'view-overview',
          controller: ['$rootScope', 'Styleguide', function($rootScope: any, Styleguide: any): void {
            $rootScope.currentSection = 'overview';
            // Update current reference to update the designer tool view
            $rootScope.currentReference.section = {
              header: 'Overview',
              reference: ''
            };

            $rootScope.$watch(function(): any {
              return Styleguide.config.data;
            }, function(newVal: any): void {
              if (newVal) {
                $rootScope.pageTitle = newVal.title;
              }
            });
          }]
        })
        .state('app.index.variable', {
          url: '/variable/:variableName',
          templateUrl: 'views/variable-sections.html',
          controller: 'VariablesCtrl',
          resolve: {
            loadLazyModule: ['$$animateJs', '$ocLazyLoad', function($$animateJs: any, $ocLazyLoad: any): any {
              return loadModule($$animateJs, $ocLazyLoad);
            }]
          }
        })
        .state('app.fullscreen', {
          url: '/section/:section/fullscreen',
          templateUrl: 'views/element-fullscreen.html',
          controller: 'ElementCtrl',
          resolve: {
            loadLazyModule: ['$$animateJs', '$ocLazyLoad', function($$animateJs: any, $ocLazyLoad: any): any {
              return loadModule($$animateJs, $ocLazyLoad);
            }]
          }
        })
        .state('app.index.404', {
          url: '/:all',
          templateUrl: 'views/404.html'
        });

      function loadModule($$animateJs: any, $ocLazyLoad: any): any {
        if (window['filesConfig'] && window['filesConfig'].length) {
          const moduleNames: string[] = [];
          angular.forEach(window['filesConfig'], function(lazyLoadmodule: any): void {
            moduleNames.push(lazyLoadmodule.name);
          });
          return $ocLazyLoad.load(moduleNames);
        }
        return undefined;
      }

      $locationProvider.html5Mode(!styleguideConfig.disableHtml5Mode);
      localStorageServiceProvider.setPrefix('sgLs');

      $ocLazyLoadProvider.config({
        events: true,
        debug: true,
        modules: window['filesConfig']
      });
    }
  ])
  .factory('lodash', ['$window', function($window: any): any {
    // Use both methods to access _ so it will work eventhough $window is mocked
    return $window['_'] || window['_'];
  }])
  .run(['$rootScope', '$window', 'lodash', function($rootScope: any, $window: any, lodash: any): void {
    $rootScope.currentReference = {
      section: {}
    };

    $rootScope.$on('$stateNotFound', function(event: any, unfoundState: any): void {
      if (unfoundState.to === '-') {
        event.preventDefault();
        return;
      }
    });

    $rootScope.$on('$stateChangeSuccess', function(event: any, toState: any): void {
      $rootScope.viewClass = toState.viewClass;
    });

    // Create global throttled scroll
    function broadcastScrollEvent(event: Event): void {
      $rootScope.$broadcast('scroll', event);
    }

    // Some tests replace $window with a mock, make sure that we have real window
    if (typeof $window.addEventListener === 'function') {
      angular.element($window).bind('scroll', lodash.throttle(broadcastScrollEvent, 350));
    }
  }])
  .filter('addWrapper', ['Styleguide', function(Styleguide: any): (html: string) => string {
    return function(html: string): string {
      if (Styleguide.config && Styleguide.config.data && Styleguide.config.data.commonClass) {
        return '<sg-common-class-wrapper class="' + Styleguide.config.data.commonClass + '">' + html + '</sg-common-class-wrapper>';
      }
      return html;
    };
  }])
  // Trust modifier markup to be safe html
  .filter('unsafe', ['$sce', function($sce: ng.ISCEService): (val: string) => ng.ISCEService {
    return function(val: string): ng.ISCEService {
      return $sce.trustAsHtml(val);
    };
  }])
  .filter('filterRelated', function(): (variables: Variable[], sectionVariableNames: string[]) => Variable[] {
    return function(variables: Variable[], sectionVariableNames: string[]): Variable[] {
      const filtered: Variable[] = [];
      angular.forEach(variables, function(variable: Variable): void {
        if (sectionVariableNames && sectionVariableNames.indexOf(variable.name) > -1) {
          filtered.push(variable);
        }
      });
      return filtered;
    };
  })
  // Replaces modifier markup's {$modifiers} with modifier's modifierClass
  .filter('setModifierClass', function(): (items: string, modifierClass: string) => string {
    return function(items: string, modifierClass: string): string {
      if (items) {
        items = items.replace(/\{\$modifiers\}/g, modifierClass);
      }
      return items;
    };
  })
  // Replace $variables with values found in variables object
  .filter('setVariables', ['lodash', function(_: any): (str: string, variables: any[]) => string {
    function filterFn(str: string, variables: any[]): string {
      if (!str) {
        return '';
      }

      let sortedVariables;
      if (variables) {
        sortedVariables = variables.slice().sort(function(a: any, b: any): number {
          return b.name.length - a.name.length;
        });
      }

      angular.forEach(sortedVariables, function(variable: any): void {
        let cleanedValue = variable.value.replace(/\s*\!default$/, '');

        if (cleanedValue.match('\[\$\@]') !== null) {
          const varName = cleanedValue.substring(1);
          angular.forEach(sortedVariables, function(_var: any): void {
            if (_var.name === varName) {
              cleanedValue = _var.value;
            }
          });
        }

        str = str.replace(new RegExp('\[\$\@]' + variable.name, 'g'), cleanedValue);
      });
      return str;
    }
    return _.memoize(filterFn);
  }]);
