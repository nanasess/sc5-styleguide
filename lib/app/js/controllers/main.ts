'use strict';

// インターフェース定義
interface MainScope extends ng.IScope {
  sections: {
    data: any[];
  };
  config: any;
  status: any;
  variables: any[];
  toggleMenu: boolean;
  markupSection: {
    isVisible: boolean | string;
  };
  designerTool: {
    isVisible: boolean;
  };
  search?: {
    $?: string;
  };
  socketService: SocketService;
  toggleSideNav: (toggleMenu: boolean) => boolean;
  isMainSectionNavigable: () => string;
  isSideNav: () => string | undefined;
  filterMainSections: () => (section: any) => boolean;
  filterSubsections: (parentSection: any) => (section: any) => boolean;
  hasSubsections: (parentSection: any) => boolean;
  toggleMarkup: () => void;
  clearSearch: () => void;
}

// 既存の Section インターフェースを使用するため削除

// バンドリングのために export 追加（必要に応じてコメントアウト）
// export function MainCtrl() {}

angular.module('sgApp')
  .controller('MainCtrl', ['$scope', '$location', '$state', 'Styleguide', 'Variables', 'localStorageService', 'Socket',
    function($scope: MainScope, 
             $location: ng.ILocationService, 
             $state: any, 
             Styleguide: StyleguideService, 
             Variables: VariablesService, 
             localStorageService: any, 
             Socket: SocketService) {

    // Bind scope variables to service updates
    $scope.sections = Styleguide.sections;
    $scope.config = Styleguide.config;
    $scope.status = Styleguide.status;
    $scope.variables = Variables.variables;
    $scope.toggleMenu = true;
    $scope.markupSection = {isVisible: ''};

    $scope.$watch('config.data', function() {
      if ($scope.config.data) {
        $scope.markupSection = {isVisible: $scope.config.data.showMarkupSection};
        localStorageService.bind($scope, 'markupSection', {isVisible: $scope.config.data.showMarkupSection});
      }
    });

    $scope.designerTool = {isVisible: false};
    localStorageService.bind($scope, 'designerTool', {isVisible: false});

    $scope.toggleSideNav = function(toggleMenu: boolean): boolean {
      $scope.toggleMenu = !toggleMenu;
      return $scope.toggleMenu;
    };

    $scope.isMainSectionNavigable = function(): string {
      return $scope.config.data.hideSubsectionsOnMainSection ? '-' : 'app.index.section({section: section.reference})';
    };

    $scope.isSideNav = function(): string | undefined {
      if ($scope.config.data && $scope.config.data.sideNav) {
        return 'sideNav';
      } else if ($scope.config.data && !$scope.config.data.sideNav) {
        return 'topNav';
      }
      return undefined;
    };

    // Bind variable to scope to wait for data to be resolved
    $scope.socketService = Socket;

    // Check if section is a main section
    $scope.filterMainSections = function() {
      return function(section: any): boolean {
        return !!section.reference && /^[A-Za-z0-9_-]+$/.test(section.reference);
      };
    };

    $scope.filterSubsections = function(parentSection: any) {
      return function(section: any): boolean {
        return new RegExp('^' + parentSection.reference + '\.[A-Za-z0-9_-]+$').test(section.reference);
      };
    };

    $scope.hasSubsections = function(parentSection: any): boolean {
      let result = false;
      angular.forEach($scope.sections.data, function(section: any) {
        if (parentSection.reference === section.parentReference) {
          result = true;
          return;
        }
      });

      return result;
    };

    // Toggle all markup boxes visible/hidden state
    $scope.toggleMarkup = function(): void {
      $scope.markupSection.isVisible = !$scope.markupSection.isVisible;
      for (let i = 0; i < $scope.sections.data.length; i++) {
        $scope.sections.data[i].showMarkup = !!$scope.markupSection.isVisible;
      }
    };

    // Change route to /all when searching
    $scope.$watch('search.$', function(newVal: string) {
      if (typeof newVal === 'string') {
        $state.go('app.index.search', {section: 'all'});
      }
    });

    // Clear search
    $scope.clearSearch = function(): void {
      if ($scope.search) {
        $scope.search = {};
      }
    };

  }]);
