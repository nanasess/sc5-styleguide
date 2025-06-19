var gulp = require('gulp'),
  styleguide = require('./lib/styleguide'),
  postcss = require('gulp-postcss'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  merge = require('merge-stream'),
  { series, parallel, watch } = require('gulp'), // Added
  source = 'lib/app/css/*.css',
  outputPath = 'demo-output',
  del = require('del'); // del v6.1.1を使用

// クリーンアップタスク
gulp.task('clean', function() {
  return del([
    'lib/app/js/components/*',
    'lib/dist/*',
    'demo-output/*'
  ]);
});

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
  // 変数ファイルのパスを設定
  const variableFiles = [
    'lib/app/css/_styleguide_variables.css', 
    'lib/app/css/_styleguide_custom_variables.css'
  ];
  
  // highlight.jsのスタイルをコピー
  gulp.src('node_modules/highlight.js/styles/**/*.css')
    .pipe(gulp.dest(outputPath + '/css/highlight'));
  
  // github.cssをハイライトスタイルとしてコピー
  gulp.src('lib/app/css/components/github.css')
    .pipe(gulp.dest(outputPath + '/css/components'));
    
  // アプリケーションスタイルの処理
  return gulp.src('lib/app/css/styleguide-app.css')
    .pipe(postcss([
      require('postcss-import'),
      require('postcss-advanced-variables')({
        // 変数が見つからない場合はそのままにする
        unresolved: 'ignore',
        // デフォルト値と変数解決の優先度を調整
        disable: {
          'default': false, // !defaultを処理する
          'global': false,  // グローバル変数を有効にする
          // その他の機能は必要に応じて無効化
        },
        // 変数ファイルを明示的にインポート
        variables: (() => {
          const fs = require('fs');
          // 変数ファイルから変数を読み込む
          const variables = {};
          variableFiles.forEach(file => {
            try {
              if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');
                // 簡易的な変数抽出（より堅牢な方法が必要かもしれません）
                const matches = content.match(/\$([\w-]+):\s*([^;!]+)(?:!default)?;/g);
                if (matches) {
                  matches.forEach(match => {
                    const nameMatch = match.match(/\$([\w-]+):/);
                    const valueMatch = match.match(/:\s*([^;!]+)(?:!default)?;/);
                    if (nameMatch && valueMatch) {
                      const name = nameMatch[1];
                      const value = valueMatch[1].trim();
                      variables[name] = value;
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
          'hwb-function': true,
          'color-function': true
        }
      }),
      require('postcss-color-alpha'),
      require('autoprefixer')
    ], { syntax: require('postcss-scss') }))
    .pipe(rename('styleguide-app.css'))
    .pipe(styleguide.applyStyles())
    .pipe(gulp.dest(outputPath));
});

gulp.task('styleguide:static', function() {
  gulp.src(['lib/demo/**'])
    .pipe(gulp.dest(outputPath + '/demo'));
});

// highlight.js のビルド
gulp.task('styleguide:highlight', function() {
  // highlight.js本体をコピー
  const hljs = gulp.src([
    'node_modules/highlight.js/lib/highlight.js'
  ])
  .pipe(gulp.dest(outputPath + '/js/highlight'));
  
  // 言語モジュールをコピー
  const hljsLanguages = gulp.src([
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
    'node_modules/highlight.js/lib/languages/python.js'
  ])
  .pipe(gulp.dest(outputPath + '/js/highlight/languages'));
  
  // サポートスクリプトは gulpfile.babel.js で処理されるため削除
  
  return merge(hljs, hljsLanguages);
});

// vendor.js のビルド
gulp.task('styleguide:vendor', function() {
  // highlight.jsのメインライブラリを最初に読み込む
  const hljs = gulp.src([
    'node_modules/highlight.js/lib/highlight.js'
  ]);
  
  // 次に言語モジュールを読み込む
  const hljsLanguages = gulp.src([
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
    'node_modules/highlight.js/lib/languages/python.js'
  ]);
  
  // 言語モジュールをグローバル変数にエクスポートするスクリプトと登録スクリプトは gulpfile.babel.js で処理されるため削除
  
  // その他のAngularモジュール
  const angularModules = gulp.src([
    'node_modules/angular-highlightjs/build/angular-highlightjs.js'
  ]);
  
  // すべてのストリームを順番に結合
  return merge(hljs, hljsLanguages, angularModules)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(outputPath + '/js'));
});

// Define styleguide task using parallel
const styleguideTask = parallel('styleguide:static', 'styleguide:generate', 'styleguide:applystyles', 'styleguide:vendor', 'styleguide:highlight');
gulp.task('styleguide', styleguideTask);


gulp.task('watch', series(styleguideTask, function watchFiles() { // Use series and named function
  // Start watching changes and update styleguide whenever changes are detected
  watch(source, styleguideTask); // Use the defined parallel task
}));
