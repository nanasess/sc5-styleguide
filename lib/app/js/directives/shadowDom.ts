'use strict';

interface StyleguideService {
  config: any;
}

interface HtmlElementWithShadow extends HTMLElement {
  createShadowRoot: () => DocumentFragment;
}

angular.module('sgApp')
  .directive('shadowDom', function(Styleguide: StyleguideService, $templateCache: ng.ITemplateCacheService) {

    var USER_STYLES_TEMPLATE = 'userStyles.html';

    return {
      restrict: 'E',
      transclude: true,
      link: function(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controller: any, transclude: ng.ITranscludeFunction) {

        scope.$watch(function() {
          return Styleguide.config;
        }, function() {
          if (typeof (<HtmlElementWithShadow>element[0]).createShadowRoot === 'function' && 
              (Styleguide.config && Styleguide.config.data && !Styleguide.config.data.disableEncapsulation)) {
            
            angular.element(element[0]).empty();
            var shadowRoot = (<HtmlElementWithShadow>element[0]).createShadowRoot();
            var root = angular.element(shadowRoot as any);
            root.append($templateCache.get(USER_STYLES_TEMPLATE));
            
            transclude(function(clone) {
              // JQueryオブジェクトを適切に扱う
              Array.prototype.forEach.call(clone, function(el) {
                root.append(el);
              });
            });
          } else {
            transclude(function(clone) {
              var root = angular.element(element[0]);
              root.empty();
              root.append(clone);
            });
          }
        }, true);

      }
    };
  });
