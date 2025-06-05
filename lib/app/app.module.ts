import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';

// Import Angular services that will replace AngularJS services gradually
// import { StyleguideService } from './services/styleguide.service';

@NgModule({
  imports: [
    BrowserModule,
    UpgradeModule
  ],
  providers: [
    // Add Angular services here
    // StyleguideService
  ]
})
export class AppModule {
  constructor(private upgrade: UpgradeModule) {}
  
  ngDoBootstrap() {
    // This is intentionally empty as we bootstrap AngularJS manually in main.ts
  }
}