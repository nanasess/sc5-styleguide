'use strict';

var postcss = require('postcss'),
    _ = require('lodash');

module.exports.stylesFromString = function(cssString, options) {
  var root, result = postcss.root();

  function pseudoMatcher() {
    var pseudoSelectors = [
      'hover', 'enabled', 'disabled', 'active', 'visited',
      'focus', 'target', 'checked', 'empty', 'first-of-type', 'last-of-type',
      'first-child', 'last-child'
    ],
      notInsideParentheses = '(?![^(]*\\))';
    // Match all pseudo selectors that are not inside parentheses
    return new RegExp('(\\:' + (pseudoSelectors.join(notInsideParentheses + '|\\:')) + notInsideParentheses + ')', 'g');
  }

  try {
    root = postcss.parse(cssString, { from: options && options.source });
  } catch (err) {
    console.error('An error occurred when creating pseudo styles:', err.toString());
    return '';
  }

  root.walkRules(function(rule) {
    // Check if any selector has pseudo class
    var hasPseudo = false;
    var newSelectors = [];
    
    rule.selector.split(',').forEach(function(selector) {
      selector = selector.trim();
      if (pseudoMatcher().test(selector)) {
        hasPseudo = true;
        // Replace pseudo class with actual class
        var newSelector = selector.replace(pseudoMatcher(), function(matched) {
          return matched.replace(/\:/g, '.pseudo-class-');
        });
        newSelectors.push(newSelector);
      }
    });
    
    // If rule has pseudo selectors, create new rule with modified selectors
    if (hasPseudo && newSelectors.length > 0) {
      var newRule = rule.clone();
      newRule.selector = newSelectors.join(', ');
      result.append(newRule);
    }
  });
  
  return result.toString();
};
