'use strict';

/// <reference path="../interfaces.d.ts" />

// インターフェース定義
interface ElementScope extends ng.IScope {
  section: Section;
  markup: string;
  variables: Variable[];
  previousSection: string | boolean;
  nextSection: string | boolean;
}

angular.module('sgApp')
  .controller('ElementCtrl', ['$scope', '$rootScope', '$stateParams', '$state', 'Styleguide', 'Variables', '$filter', '$location',
    function($scope: ElementScope, 
             $rootScope: any,
             $stateParams: any, 
             $state: any, 
             Styleguide: StyleguideService, 
             Variables: VariablesService, 
             $filter: ng.IFilterService, 
             $location: ng.ILocationService) {

    const section: string[] = $stateParams.section.split('-');
    const reference: string = section[0];
    const modifier: string = section[1];

    $rootScope.$watch(function(): Section[] {
      return Styleguide.sections.data;
    }, function() {
      updatePageData();
    });

    $rootScope.$watch(function(): any {
      return Styleguide.config.data;
    }, function() {
      updatePageData();
    });

    function previousSection(sections: Section[], result: Section[]): string | boolean {
      let sec: Section;
      let i: number;
      let m: string | number = modifier;
      sec = result[0];
      
      if (result.length > 0) {
        if (!modifier || modifier <= '1') {
          i = sections.indexOf(result[0]) - 1;
          for (i; i >= 0; i--) {
            sec = sections[i];
            if (sec.hasOwnProperty('modifiers')) {
              if (sec.modifiers.length > 0) {
                break;
              } else if (sec.hasOwnProperty('markup') && sec.markup) {
                return sec.reference;
              }
            }
          }
          if (sec.hasOwnProperty('modifiers') && sec.modifiers.length > 0) {
            m = sec.modifiers.length + 1;
          } else {
            return false;
          }
        }
        return sec.reference + '-' + (parseInt(m as string) - 1);
      }
      return false;
    }

    function nextSection(sections: Section[], result: Section[]): string | boolean {
      let sec: Section;
      let i: number;
      let m: string | number = modifier;
      sec = result[0];
      
      if (result.length > 0) {
        if (!modifier || modifier >= sec.modifiers.length.toString()) {
          i = sections.indexOf(result[0]) + 1;
          for (i; i < sections.length; i++) {
            sec = sections[i];
            if (sec.hasOwnProperty('modifiers')) {
              if (sec.modifiers.length > 0) {
                m = 0;
                break;
              } else if (sec.hasOwnProperty('markup') && sec.markup) {
                return sec.reference;
              }
            }
          }
        }
        if (sec.modifiers.length === 0) {
          return false;
        }
        return sec.reference + '-' + (parseInt(m as string) + 1);
      }
      return false;
    }

    function getSectionMarkup(section: Section): string {
      const setModifierClassFilter = $filter<(input: string, modifierClass: string) => string>('setModifierClass');
      const setVariablesFilter = $filter<(input: string, variables: Variable[]) => string>('setVariables');
      return setVariablesFilter(setModifierClassFilter(section.renderMarkup, section.className), $scope.variables);
    }

    function updatePageData(): void {
      const recursive: boolean = !!$location.search().recursive;
      const separator: string = '<br>';
      let sections: Section[];
      let result: Section[];
      let element: Section;
      let markup: string;
      let modifierStr: string;

      if (!Styleguide.sections.data) {
        return;
      }
      sections = Styleguide.sections.data;

      // Find correct element definition from styleguide data
      result = sections.filter(function(section) {
        if (reference === 'all') {
          return true;
        }
        if (recursive) {
          return new RegExp('^' + reference + '(\\D|$)').test(section.reference);
        } else {
          return reference === section.reference;
        }
      });

      if (result.length > 0) {
        element = result[0];

        // Set page title
        if (Styleguide.config.data) {
          modifierStr = modifier ? '-' + modifier.toString() : '';
          $rootScope.pageTitle = element.reference + modifierStr + ' ' + element.header + ' - ' + Styleguide.config.data.title;
        }

        // Set the actual page content
        $scope.previousSection = previousSection(sections, result);
        $scope.nextSection = nextSection(sections, result);
        $scope.variables = Variables.variables;

        // Collect every component markup when using recursive mode
        if (recursive) {
          markup = '';
          angular.forEach(result, function(section) {
            if (section.modifiers && section.modifiers.length > 0) {
              // If section contains modifier, render every modifier
              angular.forEach(section.modifiers, function(modifier) {
                markup += getSectionMarkup(modifier) + separator;
              });
            } else {
              // Otherwise just render the element
              markup += getSectionMarkup(section) + separator;
            }
          });
        } else {
          // Select correct modifier element if one is defined
          if (modifier) {
            element = element.modifiers[parseInt(modifier) - 1];
          }
          markup = getSectionMarkup(element);
        }

        $scope.section = element;
        $scope.markup = markup;
      }
    }
  }]);
