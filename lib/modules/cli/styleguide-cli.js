var path = require('path'),
  gulp = require('gulp');

module.exports = function(argv) {

  function logError(err) {
    console.error(err);
  }

  try {

    var styleguide = require(path.resolve(__dirname, '../../styleguide'));

    gulp.task('styleguide:generate', function() {
      console.log('Generating style guide to output dir:', argv.output);
      return gulp.src(argv.kssSource)
        .pipe(styleguide.generate({
          title: argv.title,
          rootPath: argv.output,
          extraHead: argv.extraHead,
          beforeBody: argv.beforeBody,
          afterBody: argv.afterBody,
          afterSections: argv.afterSections,
          sideNav: argv.sideNav,
          showMarkupSection: argv.showMarkupSection,
          commonClass: argv.commonClass,
          appRoot: argv.appRoot,
          styleVariables: argv.styleVariables,
          overviewPath: argv.overviewPath,
          server: argv.server,
          enablePug: argv.enablePug,
          port: argv.port,
          disableHtml5Mode: argv.disableHtml5Mode,
          customColors: argv.customColors,
          disableEncapsulation: argv.disableEncapsulation,
          includeDefaultStyles: argv.includeDefaultStyles,
          filesConfig: argv.filesConfig,
          isTesting: argv.isTesting,
          favIcon: argv.favIcon
        }).on('error', logError))
        .pipe(gulp.dest(argv.output));
    });

    gulp.task('styleguide:applystyles', function() {
      return gulp.src(argv.styleSource)
        .pipe(styleguide.applyStyles().on('error', logError))
        .pipe(gulp.dest(argv.output));
    });

    gulp.task('watch:kss', function() {
      return gulp.watch(argv.kssSource, gulp.series('styleguide:generate'));
    });

    gulp.task('watch:styles', function() {
      return gulp.watch(argv.styleSource, gulp.series('styleguide:applystyles'));
    });

    // Gulp 4形式で直接実行する
    if (argv.watch) {
      gulp.series('styleguide:generate', 'styleguide:applystyles', gulp.parallel('watch:kss', 'watch:styles'))();
    } else {
      gulp.series('styleguide:generate', 'styleguide:applystyles')();
    }

  } catch (err) {
    console.error('Style guide generation failed');
    logError(err);
  }

};
