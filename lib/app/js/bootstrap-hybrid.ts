// Angular/AngularJS ハイブリッドアプリケーションのブートストラップ設定
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { UpgradeModule } from '@angular/upgrade/static';
import { HybridAppModule } from './hybrid-app.module';

// AngularとAngularJSを共存させるための設定
platformBrowserDynamic()
  .bootstrapModule(HybridAppModule)
  .then(platformRef => {
    const upgrade = platformRef.injector.get(UpgradeModule) as UpgradeModule;
    
    // AngularJSアプリケーションをブートストラップ
    upgrade.bootstrap(document.body, ['sgApp'], { strictDi: true });
    
    console.log('Hybrid application bootstrapped successfully');
  })
  .catch(err => console.error('Error bootstrapping hybrid application:', err));