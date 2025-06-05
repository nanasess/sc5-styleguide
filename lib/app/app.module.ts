import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { UpgradeModule, downgradeInjectable } from '@angular/upgrade/static';

// Import Angular services
import { SocketService } from './js/services/socket.service';
import { StyleguideService } from './js/services/styleguide.service';
import { VariablesService } from './js/services/variables.service';

// Declare the AngularJS module to add downgraded services
declare var angular: any;

@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    UpgradeModule
  ],
  providers: [
    SocketService,
    StyleguideService,
    VariablesService,
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
      .factory('VariablesNg', downgradeInjectable(VariablesService));
  }
}