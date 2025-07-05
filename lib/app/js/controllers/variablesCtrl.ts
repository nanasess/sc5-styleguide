'use strict';

/// <reference path="../interfaces.d.ts" />

// インターフェース定義
interface VariablesScope extends ng.IScope {
  currentVariable: string;
  relatedSections: Section[];
  clearSearch: () => void;
  getLevel: () => string;
}

angular.module('sgApp')
  .controller('VariablesCtrl', ['$rootScope', '$scope', '$stateParams', '$location', 'Styleguide',
    function($rootScope: any, 
             $scope: VariablesScope, 
             $stateParams: any, 
             $location: ng.ILocationService, 
             Styleguide: StyleguideService) {

    $rootScope.currentSection = '';
    $scope.clearSearch();

    if ($stateParams.variableName) {
      $scope.currentVariable = $stateParams.variableName;
    } else {
      $location.url('overview');
    }

    $scope.getLevel = function(): string {
      return 'sub';
    };

    findSectionsUsingVariable();

    $rootScope.$on('styles changed', findSectionsUsingVariable);

    function findSectionsUsingVariable(): void {
      var sections = Styleguide.sections;
      if (sections && sections.data) {
        $scope.relatedSections = sections.data.filter(function(section: Section) {
          return section.variables && section.variables.some(function(variable: Variable) {
            return variable.name === $scope.currentVariable;
          });
        });
      } else {
        $scope.relatedSections = [];
      }
    }
  }]);
