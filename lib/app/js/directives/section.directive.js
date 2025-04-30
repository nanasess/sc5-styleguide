'use strict';

angular.module('sgApp')
  .directive('sgSection', function(Styleguide, Variables) {
    return {
      restrict: 'A',
      replace: true,
      templateUrl: 'views/partials/section.html',
      scope: {
        section: '=',
        markupSection: '='
      },
      link: function(scope, element, attrs) {
        // セクションを適切に表示するための処理
        scope.status = {
          isVisible: false,
          hasError: false
        };
        
        scope.config = Styleguide.config;
        scope.variables = Variables.variables;
        
        scope.toggleMarkup = function() {
          scope.status.isVisible = !scope.status.isVisible;
        };
        
        scope.isActive = function(section) {
          return section.reference === Styleguide.currentSection ? 'active' : '';
        };
        
        scope.isEmptyMainSection = function(section) {
          return section.reference.indexOf('.') === -1 && !section.renderMarkup && (!section.modifiers || section.modifiers.length === 0);
        };
      }
    };
  });
