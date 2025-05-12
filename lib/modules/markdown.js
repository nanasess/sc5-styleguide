'use strict';

var vfs = require('vinyl-fs'),
  md = require('markdown-it')({
    html: true
  }),
  through = require('through2'),
  cheerio = require('cheerio'),
  excludeLinks = [
    'https://travis-ci.org/SC5/sc5-styleguide',
    'https://david-dm.org/SC5/sc5-styleguide'
  ];

function dasherize(str) {
  return str.replace(/\s/ig, '-').toLowerCase();
}

module.exports = {
  getStream: function(filePath) {
    return vfs.src(filePath)
      .pipe(this.processStream());
  },

  processStream: function() {
    var _this = this,
    throughOpts = {
      objectMode: true,
      allowHalfOpen: false
    };

    function bufferFileContents(file, enc, done) {
      file.contents = new Buffer(_this.render(file.contents.toString()));
      // jshint -W040
      this.push(file);
      // jshint +W040
      done();
    }

    return through(throughOpts, bufferFileContents, function(cb) {
      cb();
    });
  },

  render: function(string) {
    if (!string) {
      return '';
    }
    return this.processHtml(md.render(string));
  },

  processHtml: function(html) {
    var $ = cheerio.load(html, null, false);
    // Switch fence code block with angular-highlightjs friendly div
    $('pre > code').each(function() {
      var code = $(this);
      var lang = '';
      if (code.attr('class') !== 'lang-escape-hljs') {
        if (code.attr('class')) {
          lang = code.attr('class').split(/\s+/).reduce(function(pv, cv) {
            return pv + (cv.startsWith('language-') ? cv.substr(9) + ' ' : '');
          }, '').trim();
        }
        var parent = code.parent();
        if (lang) {
          parent.replaceWith('<div hljs="" hljs-language="' + lang + '">' + code.html() + '</div>');
        } else {
          parent.replaceWith('<div hljs="">' + code.html() + '</div>');
        }
      }
    });
    $('p, a, li, pre, h1, h2, h3, h4, h5, h6, table, thead, tbody, tr, th, td').not('[sg-no-style]').addClass('sg');
    excludeLinks.forEach(function(link) {
      $('a[href^="' + link + '"]').remove();
    });
    $('h1, h2, h3, h4, h5, h6').each(function() {
      $(this).attr('name', dasherize($(this).text()));
    });
    // Add scroll directive to anchor links
    $('a').each(function() {
      var target = this.attribs && this.attribs.href;
      if (target && target.substring(0, 1) === '#') {
        $(this).attr('du-smooth-scroll', 'yes');
      }
    });
    // In cheerio v1.0.0+, $.html() returns the full HTML document
    // For backward compatibility, we need to extract only the body content
    // When decodeEntities option is set to false, we can just use $.html()
    return $.html();
  }
};
