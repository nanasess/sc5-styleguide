import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { UpgradeModule } from '@angular/upgrade/static';
import { AppModule } from './app.module';

// Import AngularJS application
import './js/app';

// Bootstrap the hybrid application
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(platformRef => {
    // Get the UpgradeModule instance
    const upgrade = platformRef.injector.get(UpgradeModule) as UpgradeModule;
    
    // Bootstrap the AngularJS application with Angular
    upgrade.bootstrap(document.body, ['sgApp'], { strictDi: true });
    
    console.log('Hybrid Angular/AngularJS application bootstrapped successfully');
  })
  .catch(err => {
    console.error('Error starting application:', err);
  });