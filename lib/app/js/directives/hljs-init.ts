'use strict';

/**
 * highlight.js の初期化を行うディレクティブ
 * このディレクティブはAngularアプリケーションが初期化された後に
 * highlight.jsの各言語モジュールを登録します
 */
angular.module('sgApp')
  .run(['$rootScope', function($rootScope: ng.IRootScopeService) {
    // highlight.js言語の初期化
    if (typeof window['hljs'] !== 'undefined' && 
        typeof window['hljsLanguages'] !== 'undefined') {
      
      const hljs = window['hljs'];
      const languages = window['hljsLanguages'];
      
      // 読み込まれた全言語を登録
      Object.keys(languages).forEach((lang: string) => {
        try {
          hljs.registerLanguage(lang, languages[lang]);
          console.log(`Registered highlight.js language: ${lang}`);
        } catch (e) {
          console.error(`Failed to register highlight.js language ${lang}:`, e);
        }
      });
      
      // 初期化完了イベントを発行
      $rootScope.$broadcast('hljs:init:complete');
      console.log('highlight.js initialization complete');
    } else {
      console.error('highlight.js or language modules not available');
    }
  }]);
