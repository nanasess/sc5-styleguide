'use strict';

var postcss = require('postcss');

module.exports = {
  stylesFromString: function(string, options) {
    var root, result = postcss.root();

    try {
      root = postcss.parse(string, { from: options && options.source });
    } catch (err) {
      console.error('An error occurred when extracting at-rules:', err.toString());
      return '';
    }

    root.walkAtRules(function(atRule) {
      if (atRule.name === 'keyframes' || atRule.name === 'font-face' ||
          atRule.name === '-webkit-keyframes' || atRule.name === '-moz-keyframes') {
        result.append(atRule.clone());
      }
    });

    return result.toString();
  }
};
