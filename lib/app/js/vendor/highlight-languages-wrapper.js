// highlight.js language registration wrapper
// This file makes language modules available as global variables
(function() {
  'use strict';
  
  // Global object to store language modules
  window.hljsLanguages = window.hljsLanguages || {};
  
  // Store language modules - these will be assigned by the concatenation process
  // This approach works with highlight.js v9
  try {
    // Make languages available globally
    if (typeof bash !== 'undefined') window.hljsLanguages.bash = bash;
    if (typeof javascript !== 'undefined') window.hljsLanguages.javascript = javascript;
    if (typeof css !== 'undefined') window.hljsLanguages.css = css;
    if (typeof xml !== 'undefined') window.hljsLanguages.xml = xml;
    if (typeof json !== 'undefined') window.hljsLanguages.json = json;
    if (typeof scss !== 'undefined') window.hljsLanguages.scss = scss;
    if (typeof typescript !== 'undefined') window.hljsLanguages.typescript = typescript;
    if (typeof yaml !== 'undefined') window.hljsLanguages.yaml = yaml;
    if (typeof markdown !== 'undefined') window.hljsLanguages.markdown = markdown;
    if (typeof php !== 'undefined') window.hljsLanguages.php = php;
    if (typeof ruby !== 'undefined') window.hljsLanguages.ruby = ruby;
    if (typeof python !== 'undefined') window.hljsLanguages.python = python;
    
    console.log('highlight.js language modules exported successfully');
  } catch (e) {
    console.error('Error exporting highlight.js language modules:', e);
  }
})();
