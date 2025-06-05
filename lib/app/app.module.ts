import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { UpgradeModule, downgradeInjectable, downgradeComponent } from '@angular/upgrade/static';

// Import Angular services
import { SocketService } from './js/services/socket.service';
import { StyleguideService } from './js/services/styleguide.service';
import { VariablesService } from './js/services/variables.service';
import { HljsInitService, hljsInitFactory } from './js/services/hljs-init.service';

// Import Angular directives
import { RootCssClassDirective } from './js/directives/root-css-class.directive';

// Import Angular components
import { VariableComponent } from './js/components/variable.component';
import { DesignComponent } from './js/components/design.component';
import { SectionComponent } from './js/components/section.component';
import { ShadowDomComponent } from './js/components/shadow-dom.component';
import { DynamicCompileComponent } from './js/components/dynamic-compile.component';
import { MainComponent } from './js/components/main.component';
import { SectionsComponent } from './js/components/sections.component';
import { VariablesPageComponent } from './js/components/variables.component';
import { AppRootComponent } from './js/components/app.component';

// Declare the AngularJS module to add downgraded services
declare var angular: any;

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    UpgradeModule
  ],
  declarations: [
    RootCssClassDirective,
    VariableComponent,
    DesignComponent,
    SectionComponent,
    ShadowDomComponent,
    DynamicCompileComponent,
    MainComponent,
    SectionsComponent,
    VariablesPageComponent,
    AppRootComponent
  ],
  providers: [
    SocketService,
    StyleguideService,
    VariablesService,
    HljsInitService,
    // APP_INITIALIZER for hljs initialization
    {
      provide: APP_INITIALIZER,
      useFactory: hljsInitFactory,
      deps: [HljsInitService],
      multi: true
    },
    // Provide $window for Angular services
    { provide: '$window', useFactory: () => window },
    // Provide $rootScope for hybrid compatibility
    { 
      provide: '$rootScope', 
      useFactory: (i: any) => i.get('$rootScope'), 
      deps: ['$injector'] 
    },
    // Provide $templateCache for shadow-dom component
    { 
      provide: '$templateCache', 
      useFactory: (i: any) => i.get('$templateCache'), 
      deps: ['$injector'] 
    },
    // Provide $location and $state for main component
    { 
      provide: '$location', 
      useFactory: (i: any) => i.get('$location'), 
      deps: ['$injector'] 
    },
    { 
      provide: '$state', 
      useFactory: (i: any) => i.get('$state'), 
      deps: ['$injector'] 
    },
    { 
      provide: 'localStorageService', 
      useFactory: (i: any) => i.get('localStorageService'), 
      deps: ['$injector'] 
    },
    // Provide $stateParams for sections component
    { 
      provide: '$stateParams', 
      useFactory: (i: any) => i.get('$stateParams'), 
      deps: ['$injector'] 
    },
    // Provide ngProgressFactory for app component
    { 
      provide: 'ngProgressFactory', 
      useFactory: (i: any) => i.get('ngProgressFactory'), 
      deps: ['$injector'] 
    }
  ]
})
export class AppModule {
  ngDoBootstrap() {
    // Downgrade Angular services for AngularJS
    angular.module('sgApp')
      .factory('SocketNg', downgradeInjectable(SocketService))
      .factory('StyleguideNg', downgradeInjectable(StyleguideService))
      .factory('VariablesNg', downgradeInjectable(VariablesService))
      .factory('HljsInitNg', downgradeInjectable(HljsInitService))
      .directive('routeCssClassNg', downgradeComponent({ component: RootCssClassDirective }))
      .directive('sgVariableNg', downgradeComponent({ component: VariableComponent, inputs: ['variable'] }))
      .directive('sgDesignNg', downgradeComponent({ component: DesignComponent, inputs: ['currentReference', 'sections'] }))
      .directive('sgSectionNg', downgradeComponent({ component: SectionComponent, inputs: ['section', 'markupSection', 'search'] }))
      .directive('shadowDomNg', downgradeComponent({ component: ShadowDomComponent }))
      .directive('dynamicCompileNg', downgradeComponent({ component: DynamicCompileComponent, inputs: ['ngBindHtml'] }))
      .directive('appMainNg', downgradeComponent({ component: MainComponent }))
      .directive('appSectionsNg', downgradeComponent({ component: SectionsComponent }))
      .directive('appVariablesNg', downgradeComponent({ component: VariablesPageComponent }))
      .directive('appRootNg', downgradeComponent({ component: AppRootComponent }));
  }
}