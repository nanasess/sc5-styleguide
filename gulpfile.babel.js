require('@babel/register');
var gulp = require('gulp'),
    fs = require('fs'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    ghPages = require('gulp-gh-pages'),
    gulpIgnore = require('gulp-ignore'),
    plumber = require('gulp-plumber'),
    ngAnnotate = require('gulp-ng-annotate'),
    replace = require('gulp-replace'),
    { series, parallel, watch } = require('gulp'),
    toc = require('gulp-doctoc'),
    styleguide = require('./lib/styleguide'),
    postcss = require('gulp-postcss'),
    rename = require('gulp-rename'),
    rimraf = require('gulp-rimraf'),
    ts = require('gulp-typescript'),
    header = require('gulp-header'),
    sourcemaps = require('gulp-sourcemaps'),
    through2 = require('through2'),
    path = require('path'),
    through2 = require('through2'),
    path = require('path'),
    distPath = 'lib/dist',
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

function jsVendor() {
  return gulp.src([
    'node_modules/lodash/lodash.js', // Lodash を最初の方で読み込む
    'lib/app/js/vendor/**/*.js', // Keep existing vendor files
    'node_modules/highlight.js/lib/highlight.js',
    // highlight.js言語モジュールを明示的に読み込む
    'node_modules/highlight.js/lib/languages/bash.js',
    'node_modules/highlight.js/lib/languages/javascript.js',
    'node_modules/highlight.js/lib/languages/css.js',
    'node_modules/highlight.js/lib/languages/xml.js',
    'node_modules/highlight.js/lib/languages/json.js',
    'node_modules/highlight.js/lib/languages/scss.js',
    'node_modules/highlight.js/lib/languages/typescript.js',
    'node_modules/highlight.js/lib/languages/yaml.js',
    'node_modules/highlight.js/lib/languages/markdown.js',
    'node_modules/highlight.js/lib/languages/php.js',
    'node_modules/highlight.js/lib/languages/ruby.js',
    'node_modules/highlight.js/lib/languages/python.js',
    'node_modules/angular/angular.js',
    'node_modules/angular-animate/angular-animate.js',
    'node_modules/angular-highlightjs/build/angular-highlightjs.js',
    'node_modules/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
    'node_modules/angular-local-storage/dist/angular-local-storage.js',
    'node_modules/oclazyload/dist/ocLazyLoad.js',
    'node_modules/ngprogress/build/ngprogress.js',
    'node_modules/angular-debounce/dist/angular-debounce.js',
    'node_modules/angular-scroll/angular-scroll.js',
    'node_modules/event-polyfill/index.js',
    'node_modules/angular-ui-router/release/angular-ui-router.js'
  ])
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(through2.obj(function(file, enc, cb) {
      // highlight.jsの言語ファイルを処理
      const filePath = file.path;
      if (filePath.includes('highlight.js/lib/languages/')) {
        const fileName = path.basename(filePath, '.js');
        const content = file.contents.toString();
        
        // 言語モジュールをグローバルに登録するためのコードを追加
        const newContent = 
          `// Register highlight.js language: ${fileName}\n` +
          `(function() {\n` +
          `  window.hljsLanguages = window.hljsLanguages || {};\n` +
          `  var module = {};\n` +
          `  ${content}\n` +
          `  window.hljsLanguages['${fileName}'] = module.exports;\n` +
          `})();\n`;
        
        file.contents = Buffer.from(newContent);
      }
      cb(null, file);
    }))
    .pipe(concat('vendor.js'))
    .pipe(header('var global = window;\n')) // vendor.js の先頭に `var global = window;` を追加
    .pipe(sourcemaps.write('.'))
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
    .pipe(replace(/[^\\n]*Table of Contents[^\\n]*\\n/g, ''))
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
  // 変数ファイルのパスを設定
  const variableFiles = [
    distPath + '/css/_styleguide_variables.css', 
    distPath + '/css/_styleguide_custom_variables.css'
  ];
  
  return gulp.src(distPath + '/css/styleguide-app.css')
    .pipe(replace('{{{appRoot}}}', ''))
    .pipe(postcss([
      require('postcss-import'),
      require('postcss-advanced-variables')({
        // 変数が見つからない場合はそのままにする
        unresolved: 'ignore',
        // 変数ファイルを明示的にインポート
        variables: (() => {
          // 変数ファイルから変数を読み込む
          const variables = {};
          variableFiles.forEach(file => {
            try {
              if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');
                // 簡易的な変数抽出（より堅牢な方法が必要かもしれません）
                const matches = content.match(/\$([\w-]+):\s*([^;]+);/g);
                if (matches) {
                  matches.forEach(match => {
                    const [, name, value] = match.match(/\$([\w-]+):\s*([^;]+);/);
                    if (name && value) {
                      variables[name] = value.trim();
                    }
                  });
                }
              }
            } catch (e) {
              console.error(`Error loading variables from ${file}:`, e);
            }
          });
          return variables;
        })()
      }),
      require('postcss-nested'),
      require('postcss-custom-media'),
      require('postcss-preset-env')({
        features: {
          customProperties: true,
          nesting: false, // nestingプラグインを無効化して解析エラーを回避
          calc: true, // calcプラグインを有効化してcalc()関数を処理
          colorFunction: true // colorプラグインを有効化して変数を先に処理
        }
      }),
      require('postcss-color-alpha'),
      require('autoprefixer')
    ], { syntax: require('postcss-scss') }))
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
    .pipe(postcss([
      require('cssnano')()
    ]))
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

const buildDist = parallel(copyCss, jsApp, jsVendor, copyHtml, copyAssets);
const build = series(cleanDist, buildDist);

function devWatch() { // Define watch part as a separate function
  watch('lib/app/css/**/*.css', series(copyCss, devGenerate, devApplystyles));
  watch(['lib/app/js/**/*.{js,ts}', 'lib/app/views/**/*', 'lib/app/index.html', '!lib/app/js/vendor/**/*.js'], series(lintJsTask, jsApp, devGenerate));
  watch('lib/app/js/vendor/**/*.js', series(jsVendor, devGenerate)); // Removed bowerTask
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
gulp.task('js:vendor', jsVendor); // Removed bowerTask dependency
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
