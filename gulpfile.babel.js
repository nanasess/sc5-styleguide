require('@babel/register');
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    cssmin = require('gulp-cssmin'),
    ghPages = require('gulp-gh-pages'),
    gulpIgnore = require('gulp-ignore'),
    plumber = require('gulp-plumber'),
    bower = require('gulp-bower'),
    mainBowerFiles = require('main-bower-files'),
    ngAnnotate = require('gulp-ng-annotate'),
    replace = require('gulp-replace'),
    { series, parallel, watch } = require('gulp'),
    toc = require('gulp-doctoc'),
    styleguide = require('./lib/styleguide'),
    postcss = require('gulp-postcss'),
    rename = require('gulp-rename'),
    rimraf = require('gulp-rimraf'),
    ts = require('gulp-typescript'),
    distPath = 'lib/dist',
    fs = require('fs'),
    chalk = require('chalk'),
    outputPath = 'demo-output',
    webserver = require('gulp-webserver');

// Import test tasks and get the lint:js task if available
const testTasks = require('./gulpfile-tests.babel')(gulp);
const lintJsTask = testTasks && testTasks['lint:js'] ? testTasks['lint:js'] : (cb) => { console.warn('lint:js task not found'); cb(); };

// --- Define tasks as named functions ---

function jsApp() {
  return gulp.src([
    'lib/app/js/app.ts',
    'lib/app/js/controllers/*.js',
    'lib/app/js/controllers/*.ts',
    'lib/app/js/directives/*.js',
    'lib/app/js/directives/*.ts',
    'lib/app/js/services/*.js',
    'lib/app/js/services/*.ts'
  ])
  .pipe(plumber())
  .pipe(gulpIgnore.exclude('**/*.d.ts'))
  .pipe(ts(require('./tsconfig.json').compilerOptions))
  .pipe(ngAnnotate())
  .pipe(concat('app.js'))
  .pipe(gulp.dest(distPath + '/js'));
}

function bowerTask() { // Renamed from 'bower' to avoid conflict with the required module
  return bower();
}

function jsVendor() {
  return gulp.src(['lib/app/js/vendor/**/*.js'].concat(mainBowerFiles({filter: /\.js/}))) // Removed gulp.series wrapper
    .pipe(plumber())
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(distPath + '/js'));
}

function copyCss() {
  return gulp.src('lib/app/css/**/*')
    .pipe(gulp.dest(distPath + '/css'));
}

function copyHtml() { // Renamed from 'html'
  return gulp.src('lib/app/**/*.html')
    .pipe(gulp.dest(distPath + '/'));
}

function copyAssets() { // Renamed from 'assets'
  return gulp.src('lib/app/assets/**')
    .pipe(gulp.dest(distPath + '/assets'));
}

function cleanDist() {
  return gulp.src(distPath, {read: false, allowEmpty: true}) // Added allowEmpty: true
    .pipe(rimraf());
}

// Copy test directives to output even when running gulp dev
function devStatic() {
  return gulp.src(['lib/demo/**']) // Added return
    .pipe(gulp.dest(outputPath + '/demo'));
}

function devDoc() {
  return gulp.src('README.md')
    .pipe(toc())
    .pipe(replace(/[^\n]*Table of Contents[^\n]*\n/g, ''))
    .pipe(gulp.dest('./'));
}

function devGenerate() {
  return gulp.src([distPath + '/css/*.css'])
    .pipe(styleguide.generate({
      title: 'SC5 Styleguide',
      sideNav: false,
      showMarkupSection: true,
      hideSubsectionsOnMainSection: false,
      server: true,
      rootPath: outputPath,
      overviewPath: 'README.md',
      styleVariables: distPath + '/css/_styleguide_variables.css',
      includeDefaultStyles: true,
      parsers: {
        css: 'postcss'
      }
    }))
    .pipe(gulp.dest(outputPath));
}

function devApplystyles(cb) { // Added cb for async completion
  if (!fs.existsSync(distPath) || !fs.existsSync(distPath + '/css/styleguide-app.css')) {
    process.stderr.write(chalk.red.bold('Error:') + ' Directory ' + distPath + ' does not exist. You probably installed library by cloning repository directly instead of NPM repository.\n');
    process.stderr.write('You need to run ' + chalk.green.bold('gulp build') + ' first\n');
    // process.exit(1); // Avoid exiting, let Gulp handle error
    return cb(new Error(distPath + ' does not exist. Run `gulp build` first.')); // Signal error
  }
  return gulp.src(distPath + '/css/styleguide-app.css')
    .pipe(replace('{{{appRoot}}}', ''))
    .pipe(postcss([
      require('postcss-partial-import'),
      require('postcss-mixins'),
      require('postcss-preset-env')({
        features: {
          customProperties: true,
          nesting: false, // nestingプラグインを無効化して解析エラーを回避
          calc: false // calcプラグインを無効化して解析エラーを回避
        }
      }),
      require('postcss-advanced-variables'),
      require('postcss-conditionals'),
      require('postcss-color-function'),
      require('postcss-color-alpha'),
      require('postcss-nested'),
      require('postcss-custom-media'),
      require('autoprefixer'),
      require('postcss-inline-comment')
    ]))
    .pipe(replace(/url\((.*)\)/g, function(replacement, parsedPath) {
      return 'url(\'' + parsedPath.replace(/'/g, '') + '\')';
    }))
    .pipe(styleguide.applyStyles())
    .pipe(gulp.dest(outputPath));
}

function addSection() {
  return gulp.src(['lib/app/css/**/*.css'])
    .pipe(styleguide.addSection({
      parsers: {
        css: 'postcss'
      }
    }))
    .pipe(gulp.dest('lib/app/css/'));
}

function changelog(cb) {

  require('conventional-changelog')({
    repository: 'https://github.com/SC5/sc5-styleguide',
    version: require('./package.json').version,
    file: ''
  }, (err, log) => {
    if (err) {
      console.error(err);
      return cb(err);
    }
    fs.writeFile('./CHANGELOG_LATEST.md', log, (err) => {
      if (err) {
        console.error(err);
        return cb(err);
      }
      console.log('The latest changelog was updated\n\n');
      console.log(log);
      cb();
    });
  });

}

function friday(cb) {
  var today = new Date();
  // For fridays only
  if (today.getDay() !== 5) {
      console.log('Not Friday, skipping Friday message.');
      return cb(); // Important to call cb()
  }
  gutil.log(gutil.colors.magenta('┓┏┓┏┓┃'));
  gutil.log(gutil.colors.magenta('┛┗┛┗┛┃'), gutil.colors.cyan('⟍ ○⟋'));
  gutil.log(gutil.colors.magenta('┓┏┓┏┓┃'), gutil.colors.cyan('  ∕       '), 'Friday');
  gutil.log(gutil.colors.magenta('┛┗┛┗┛┃'), gutil.colors.cyan('ノ)'));
  gutil.log(gutil.colors.magenta('┓┏┓┏┓┃'), '          ', 'release,');
  gutil.log(gutil.colors.magenta('┛┗┛┗┛┃'));
  gutil.log(gutil.colors.magenta('┓┏┓┏┓┃'), '          ', 'good');
  gutil.log(gutil.colors.magenta('┛┗┛┗┛┃'));
  gutil.log(gutil.colors.magenta('┓┏┓┏┓┃'), '          ', 'luck!');
  gutil.log(gutil.colors.magenta('┃┃┃┃┃┃'));
  gutil.log(gutil.colors.magenta('┻┻┻┻┻┻'));
  cb();
}

function websiteCss() {
  return gulp.src(siteDir + 'css/*.css') // Return the stream
    .pipe(gulpIgnore.exclude('*.min.css'))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(siteDir + 'css'));
}

function websiteServer() {
  watch(siteDir + 'css/app.css', websiteCss); // Use function reference

  return gulp.src(siteDir)
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true
    }));
}

function websiteDeployClean() {
  return gulp.src('.publish', { read: false, allowEmpty: true }) // Added allowEmpty: true
    .pipe(clean());
}

function websiteDeploy() {
  return gulp.src(siteDir + '**/*')
    .pipe(ghPages({
      remoteUrl: 'git@github.com:SC5/sc5-styleguide.git'
    }));
}

// --- Combine tasks using series and parallel ---

const buildDist = parallel(copyCss, jsApp, series(bowerTask, jsVendor), copyHtml, copyAssets); // Use function references and series for jsVendor dependency
const build = series(cleanDist, buildDist);

function devWatch() { // Define watch part as a separate function
  watch('lib/app/css/**/*.css', series(copyCss, devGenerate, devApplystyles));
  watch(['lib/app/js/**/*.{js,ts}', 'lib/app/views/**/*', 'lib/app/index.html', '!lib/app/js/vendor/**/*.js'], series(lintJsTask, jsApp, devGenerate));
  watch('lib/app/js/vendor/**/*.js', series(bowerTask, jsVendor, devGenerate)); // Added bowerTask dependency
  watch('lib/app/**/*.html', series(copyHtml, devGenerate));
  watch('README.md', series(devDoc, devGenerate));
  watch('lib/styleguide.js', devGenerate); // No need for series for single task
}

const dev = series(devDoc, devStatic, build, series(devGenerate, devApplystyles), devWatch);
const publish = series(friday, build, changelog);
const website = series(websiteCss, websiteServer);
const deploy = series(websiteDeployClean, websiteDeploy); // Renamed from website:deploy

// --- Register tasks with Gulp ---

gulp.task('js:app', jsApp);
gulp.task('bower', bowerTask);
gulp.task('js:vendor', series(bowerTask, jsVendor)); // Explicitly define series here too
gulp.task('copy:css', copyCss);
gulp.task('html', copyHtml);
gulp.task('assets', copyAssets);
gulp.task('clean:dist', cleanDist);
gulp.task('dev:static', devStatic);
gulp.task('dev:doc', devDoc);
gulp.task('dev:generate', devGenerate);
gulp.task('dev:applystyles', devApplystyles);
gulp.task('build:dist', buildDist);
gulp.task('build', build);
gulp.task('dev', dev);
gulp.task('addsection', addSection);
gulp.task('changelog', changelog);
gulp.task('friday', friday);
gulp.task('publish', publish);
gulp.task('website:css', websiteCss);
gulp.task('website', website);
gulp.task('website:deploy:clean', websiteDeployClean);
gulp.task('website:deploy', deploy);

// Export default task if needed, e.g., gulp.task('default', build);
