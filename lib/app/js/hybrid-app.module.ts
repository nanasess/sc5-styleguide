// ハイブリッドアプリケーションモジュール
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';

// AngularJSサービスのアップグレードプロバイダー
import { angularjsUpgradeProviders } from './upgrade-providers';

// ダミーのルートコンポーネント（AngularJSが制御を持つため実際には使用されない）
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<div></div>'
})
export class RootComponent { }

@NgModule({
  imports: [
    BrowserModule,
    UpgradeModule
  ],
  declarations: [
    RootComponent
  ],
  providers: [
    // AngularJSサービスをAngularで使用できるようにするプロバイダー
    ...angularjsUpgradeProviders
  ],
  bootstrap: [RootComponent]
})
export class HybridAppModule {
  constructor(private upgrade: UpgradeModule) {}
  
  ngDoBootstrap() {
    // UpgradeModuleがAngularJSのブートストラップを処理
  }
}