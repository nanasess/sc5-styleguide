'use strict';

angular.module('sgApp')
  .directive('sgSection', function($rootScope, $window, $timeout, Styleguide, Variables) {
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

        // section.js から統合した機能
        function updateCurrentReference() {
          var topOffset = element[0].offsetTop,
            bottomOffset = element[0].offsetTop + element[0].offsetHeight,
            buffer = 50;

          if ($window.pageYOffset > topOffset - buffer && $window.pageYOffset < bottomOffset - buffer) {
            if (!$rootScope.currentReference || !$rootScope.currentReference.section || 
                $rootScope.currentReference.section.reference !== scope.section.reference) {
              // Assign new current section
              if (!$rootScope.currentReference) {
                $rootScope.currentReference = {};
              }
              $rootScope.currentReference.section = scope.section;
              if (!scope.$$phase) {
                $rootScope.$apply();
              }
            }
          }
        }

        // Init markup visibility based on global setting
        scope.section.showMarkup = scope.markupSection.isVisible;
        // By default do not show CSS markup
        scope.section.showCSS = false;

        // Listen to scroll events and update currentReference if this section is currently focused
        scope.$on('scroll', function() {
          updateCurrentReference();
        });

        scope.$watch('search.$', function() {
          // Search is not processed completely yet
          // We want to run updateCurrentReference after digest is complete
          $timeout(function() {
            updateCurrentReference();
          });
        });

        // Section location will change still after initialzation
        // We want to run updateCurrentReference after digest is complete
        $timeout(function() {
          updateCurrentReference();
        });
      }
    };
  });
