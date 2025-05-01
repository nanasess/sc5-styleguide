'use strict';

interface DynamicCompileAttributes extends ng.IAttributes {
  ngBindHtml: string;
}

angular.module('sgApp')
  .directive('dynamicCompile', function($compile: ng.ICompileService, $parse: ng.IParseService, $window: ng.IWindowService) {
    return {
      link: function(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: DynamicCompileAttributes) {
        var parsed = $parse(attrs.ngBindHtml);
        function getStringValue(): string { 
          return (parsed(scope) || '').toString(); 
        }
        
        // Recompile if the template changes
        scope.$watch(getStringValue, function() {
          $compile(element, null, 0)(scope);
          
          // Emit an event that an element is rendered
          element.ready(function() {
            var event = new CustomEvent('styleguide:onRendered', {
              detail: {
                elements: element
              },
              bubbles: true,
              cancelable: true
            });
            $window.dispatchEvent(event);
          });
        });
      }
    };
  });
