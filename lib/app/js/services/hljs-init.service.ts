import { Injectable, Inject } from '@angular/core';

/**
 * highlight.js の初期化を行うサービス
 * このサービスはAngularアプリケーションが初期化された後に
 * highlight.jsの各言語モジュールを登録します
 */
@Injectable({
  providedIn: 'root'
})
export class HljsInitService {
  
  constructor(@Inject('$rootScope') private $rootScope: any) {}
  
  initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      // highlight.js言語の初期化
      if (typeof window['hljs'] !== 'undefined' && 
          typeof window['hljsLanguages'] !== 'undefined') {
        
        const hljs = window['hljs'];
        const languages = window['hljsLanguages'];
        
        try {
          // 読み込まれた全言語を登録
          Object.keys(languages).forEach((lang: string) => {
            try {
              hljs.registerLanguage(lang, languages[lang]);
              console.log(`Registered highlight.js language: ${lang}`);
            } catch (e) {
              console.error(`Failed to register highlight.js language ${lang}:`, e);
            }
          });
          
          // 初期化完了イベントを発行（AngularJS互換性のため）
          this.$rootScope.$broadcast('hljs:init:complete');
          console.log('highlight.js initialization complete');
          
          resolve();
        } catch (error) {
          console.error('Error during highlight.js initialization:', error);
          reject(error);
        }
      } else {
        const error = new Error('highlight.js or language modules not available');
        console.error(error.message);
        reject(error);
      }
    });
  }
}

// Factory function for APP_INITIALIZER
export function hljsInitFactory(hljsInitService: HljsInitService): () => Promise<void> {
  return () => hljsInitService.initialize();
}

// AngularJS互換性のためのファクトリー関数
export function hljsInitServiceFactory(i: any) {
  return i.get('HljsInitService');
}