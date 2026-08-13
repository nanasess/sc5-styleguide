'use strict';

/// <reference path="../interfaces.d.ts" />

// インターフェース定義
interface DesignScope extends ng.IScope {
  currentReference: {
    section: {
      variables?: Variable[];
      reference: string;
    }
  };
  sections: {
    data: Section[];
  };
  status: any;
  showRelated: boolean;
  relatedChildVariableNames: string[];
  saveVariables: () => void;
  resetLocal: () => void;
  dirtyVariablesFound: () => boolean;
}

angular.module('sgApp')
  .directive('sgDesign', function(Variables: VariablesService, Styleguide: StyleguideService) {
    return {
      replace: true,
      restrict: 'A',
      templateUrl: 'views/partials/design.html',
      link: function(scope: DesignScope) {
        var parentRef: string;

        function isSubSection(section: Section): boolean {
          var ref = section.parentReference;
          return (typeof ref === 'string') &&
            (ref === parentRef || ref.substring(0, ref.indexOf('.')) === parentRef);
        }

        function getVariables(section: Section): Variable[] {
          return section.variables || [];
        }

        function concat(a: Variable[], b: Variable[]): Variable[] {
          return a.concat(b);
        }

        function unique(a: string | undefined, idx: number, arr: (string | undefined)[]): boolean {
          return a !== undefined && arr.indexOf(a) === idx;
        }

        scope.status = Styleguide.status;
        scope.showRelated = true;

        scope.$watch('currentReference.section', function() {
          var relatedVariables = scope.currentReference.section.variables || [];
          if (scope.showRelated && relatedVariables.length === 0 && scope.sections.data) {
            parentRef = scope.currentReference.section.reference;
            var childVariables = scope.sections.data.filter(isSubSection)
              .map(getVariables)
              .reduce(concat, []);
            
            // Variable配列から重複を除いた変数名の配列を作成
            scope.relatedChildVariableNames = childVariables
              .map(function(v) { return v.name; })
              .filter(function(name, idx, arr) {
                return name !== undefined && arr.indexOf(name) === idx;
              });
          }
        });

        scope.saveVariables = function() {
          Variables.saveVariables();
        };

        scope.resetLocal = function() {
          Variables.resetLocal();
        };

        scope.dirtyVariablesFound = function(): boolean {
          return Variables.variables.some(function(variable) {
            return variable.dirty && variable.dirty === true;
          });
        };
      }
    };
  });
