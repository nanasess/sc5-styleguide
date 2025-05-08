var gulp = require('gulp'),
  styleguide = require('./lib/styleguide'),
  postcss = require('gulp-postcss'),
  rename = require('gulp-rename'),
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
  // 変数ファイルのパスを設定
  const variableFiles = [
    'lib/app/css/_styleguide_variables.css', 
    'lib/app/css/_styleguide_custom_variables.css'
  ];
  
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
          customProperties: true,
          nesting: false, // nestingプラグインを無効化して解析エラーを回避
          calc: true, // calcプラグインを有効化してcalc()関数を処理
          colorFunction: true // colorプラグインを有効化して変数を先に処理
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

// Define styleguide task using parallel
const styleguideTask = parallel('styleguide:static', 'styleguide:generate', 'styleguide:applystyles');
gulp.task('styleguide', styleguideTask);


gulp.task('watch', series(styleguideTask, function watchFiles() { // Use series and named function
  // Start watching changes and update styleguide whenever changes are detected
  watch(source, styleguideTask); // Use the defined parallel task
}));
