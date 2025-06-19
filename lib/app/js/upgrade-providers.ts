// AngularJSサービスをAngularで使用するためのアップグレードプロバイダー
import { Injectable } from '@angular/core';

// AngularJSサービスのアップグレードトークン
export const STYLEGUIDE_SERVICE_TOKEN = 'Styleguide';
export const VARIABLES_SERVICE_TOKEN = 'Variables';
export const SOCKET_SERVICE_TOKEN = 'Socket';

// 今は空の配列だが、将来的にサービスアップグレードプロバイダーを追加
export const angularjsUpgradeProviders = [
  // サービスアップグレードの例:
  // {
  //   provide: StyleguideService,
  //   useFactory: (i: any) => i.get(STYLEGUIDE_SERVICE_TOKEN),
  //   deps: ['$injector']
  // }
];