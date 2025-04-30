'use strict';

// インターフェース定義
interface DesignScope extends ng.IScope {
  currentReference: {
    section: {
      variables?: string[];
      reference: string;
    }
  };
  sections: {
    data: any[];
  };
  status: any;
  showRelated: boolean;
  relatedChildVariableNames: string[];
  saveVariables: () => void;
  resetLocal: () => void;
  dirtyVariablesFound: () => boolean;
}

interface Section {
  parentReference?: string;
  variables?: string[];
  reference?: string;
}

// Variable型のインポート
interface Variable {
  name: string;
  file: string;
  value: string;
  line?: number;
  fileHash?: string;
  dirty?: boolean;
}

interface VariablesService {
  variables: Variable[];
  saveVariables: () => void;
  resetLocal: () => void;
}

interface StyleguideService {
  status: {
    hasError: boolean;
    error: any;
    errType: string;
  };
  config: any;
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

        function getVariables(section: Section): string[] {
          return section.variables || [];
        }

        function concat(a: string[], b: string[]): string[] {
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
            scope.relatedChildVariableNames = scope.sections.data.filter(isSubSection)
              .map(getVariables)
              .reduce(concat, [])
              .filter(unique as any);
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
