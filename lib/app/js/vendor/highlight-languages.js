// highlight.js language registration
// This file registers all the language modules that are loaded
(function() {
  'use strict';
  
  // DOM読み込み後に実行する関数
  function initHighlightJS() {
    // This is executed when the file is loaded
    if (typeof hljs !== 'undefined') {
      // Register all languages that should be available
      // These must match the languages loaded in gulpfile.babel.js
      hljs.registerLanguage('bash', window.hljsLanguages.bash);
      hljs.registerLanguage('javascript', window.hljsLanguages.javascript);
      hljs.registerLanguage('css', window.hljsLanguages.css);
      hljs.registerLanguage('xml', window.hljsLanguages.xml);
      hljs.registerLanguage('json', window.hljsLanguages.json);
      hljs.registerLanguage('scss', window.hljsLanguages.scss);
      hljs.registerLanguage('typescript', window.hljsLanguages.typescript);
      hljs.registerLanguage('yaml', window.hljsLanguages.yaml);
      hljs.registerLanguage('markdown', window.hljsLanguages.markdown);
      hljs.registerLanguage('php', window.hljsLanguages.php);
      hljs.registerLanguage('ruby', window.hljsLanguages.ruby);
      hljs.registerLanguage('python', window.hljsLanguages.python);
      
      console.log('highlight.js languages registered successfully');
    } else {
      console.error('highlight.js is not loaded or not available');
      // 1秒後に再試行
      setTimeout(initHighlightJS, 1000);
    }
  }
  
  // DOMが読み込まれた後に初期化する
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHighlightJS);
  } else {
    // DOMがすでに読み込まれている場合は即時実行
    initHighlightJS();
  }
})();
