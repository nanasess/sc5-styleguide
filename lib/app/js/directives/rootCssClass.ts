'use strict';

interface StateObject {
  viewClass?: string;
}

angular.module('sgApp')
.directive('routeCssClass', function($rootScope: ng.IRootScopeService) {
  return {
    restrict: 'A',
    scope: {},
    link: function (scope: ng.IScope, elem: ng.IAugmentedJQuery) {
      $rootScope.$on('$stateChangeSuccess', function (event: ng.IAngularEvent, toState: StateObject, toParams: any, fromState: StateObject) {
        var fromClassnames: string | null = angular.isDefined(fromState.viewClass) && angular.isDefined(fromState.viewClass) ? fromState.viewClass : null;
        var toClassnames: string | null = angular.isDefined(toState.viewClass) && angular.isDefined(toState.viewClass) ? toState.viewClass : null;

        fromClassnames = 'root-' + fromClassnames;
        toClassnames = 'root-' + toClassnames;
        
        // don't do anything if they are the same
        if (fromClassnames !== toClassnames) {
          if (fromClassnames) {
            elem.removeClass(fromClassnames);
          }

          if (toClassnames) {
            elem.addClass(toClassnames);
          }
        }
      });
    }
  };
});
