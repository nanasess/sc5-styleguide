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
    VariableComponent
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
      .directive('sgVariableNg', downgradeComponent({ component: VariableComponent, inputs: ['variable'] }));
  }
}