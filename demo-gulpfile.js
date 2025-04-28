var gulp = require('gulp'),
  styleguide = require('./lib/styleguide'),
  postcss = require('gulp-postcss'),
  rename = require('gulp-rename'),
  replace = require('gulp-replace'),
  { series, parallel, watch } = require('gulp'), // Added
  source = 'lib/app/css/*.css',
  outputPath = 'demo-output';

gulp.task('styleguide:generate', function() {
  return gulp.src(source)
    .pipe(styleguide.generate({
        title: 'SC5 Styleguide',
        server: true,
        rootPath: outputPath,
        overviewPath: 'README.md',
        styleVariables: 'lib/app/css/_styleguide_variables.css',
        parsers: {
          css: 'postcss'
        },
        styleguideProcessors: {
            40: function(styleguide) {
                styleguide.sections[0].description = styleguide.sections[0].description + ' [Description from custom Processor]';
            }
        }
      }))
    .pipe(gulp.dest(outputPath));
});

gulp.task('styleguide:applystyles', function() {
  return gulp.src('lib/app/css/styleguide-app.css')
    .pipe(postcss([
      require('postcss-partial-import'),
      require('postcss-mixins'),
      require('gulp-cssnext'),
      require('postcss-advanced-variables'),
      require('postcss-conditionals'),
      require('postcss-color-function'),
      require('postcss-color-alpha'),
      require('postcss-nested'),
      require('postcss-custom-media'),
      require('autoprefixer'),
      require('postcss-inline-comment')
    ]))
    // Fix Font Awesome URLs - ensure proper quotes in both URL and format functions
    // 特にFont Awesome用に対策する
    .pipe(replace(/src: url\(['"]?(.*?)['"]?\)([^;]*);/g, function(match, url, formats) {
      // HTMLエンコードされていない形式に修正
      var newFormats = formats.replace(/format\(['"]?([\w\-]+)['"]?\)/g, function(m, f) {
        return "format('" + f + "')";
      });
      return "src: url('" + url + "')" + newFormats + ";";
    }))
    // 汎用のformat修正
    .pipe(replace(/format\(['"]?([\w\-]+)['"]?\)/g, function(match, formatType) {
      return "format('" + formatType + "')";
    }))
    // 汎用のURL修正
    .pipe(replace(/url\(['"]?(.*?)['"]?\)/g, function(match, url) {
      return "url('" + url + "')";
    }))
    .pipe(rename('styleguide-app.css'))
    .pipe(styleguide.applyStyles())
    .pipe(gulp.dest(outputPath));
});

gulp.task('styleguide:static', function() {
  // Copy demo files
  gulp.src(['lib/demo/**'])
    .pipe(gulp.dest(outputPath + '/demo'));
    
  // Copy fixed Font Awesome CSS
  gulp.src(['lib/app/css/font-awesome-fix.css'])
    .pipe(gulp.dest(outputPath));
});

// Define styleguide task using parallel
const styleguideTask = parallel('styleguide:static', 'styleguide:generate', 'styleguide:applystyles');
gulp.task('styleguide', styleguideTask);


gulp.task('watch', series(styleguideTask, function watchFiles() { // Use series and named function
  // Start watching changes and update styleguide whenever changes are detected
  watch(source, styleguideTask); // Use the defined parallel task
}));
