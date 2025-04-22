'use strict';

var vfs = require('vinyl-fs'),
  path = require('path'),
  plumber = require('gulp-plumber'),
  jscs = require('gulp-jscs'),
  jshint = require('gulp-jshint'),
  mocha = require('gulp-mocha'),
  karma = require('karma').server,
  coverage = require('istanbul'),
  istanbul = require('gulp-istanbul'),
  through = require('through2'),
  { series, parallel } = require('gulp'),
  del = require('del'),
  tasks;

function srcJsLint() {
  return vfs.src([
    'gulpfile.babel.js',
    'gulpfile-tests.babel.js',
    'gulp-tasks/*',
    'bin/**/*.js',
    'lib/**/*.js',
    'test/**/*.js',
    '!lib/dist/**/*.js',
    '!lib/app/js/components/**/*.js'
  ]);
}

function runJscs() {
  return srcJsLint()
    .pipe(plumber())
    .pipe(jscs({configPath: '.jscsrc'}));
}

function runJsHint() {
  return srcJsLint()
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
}

const lintJs = parallel(runJscs, runJsHint);

function runMocha() {
  return mocha({reporter: 'spec'});
}

function runUnitTests(done) {
  vfs.src(['lib/modules/**/*.js'])
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire())
    .on('finish', () => {
      vfs.src(['test/unit/**/*.js'])
        .pipe(runMocha())
        .pipe(writeUnitTestCoverage())
        .pipe(printUnitTestCoverage())
        .on('end', done);
    });
}

function writeUnitTestCoverage() {
  return istanbul.writeReports({
    reporters: ['json'],
    reportOpts: {file: path.resolve('./coverage/unit-coverage.json')}
  });
}

function printUnitTestCoverage() {
  return istanbul.writeReports({reporters: ['text']});
}

function runStructureIntegrationTests() {
  return vfs.src(['test/integration/**/*.js', '!test/integration/npm-package.test.js']).pipe(runMocha());
}

function runIntegrationTests() {
  return vfs.src('test/integration/**/*.js').pipe(runMocha());
}

function runAngularUnitTests(done) {
  karma.start({
    configFile: path.resolve('./test/karma.conf.js'),
    exclude: ['test/angular/functional/**/*.js']
  }, done);
}

function runAngularFunctionalTests(done) {
  karma.start({
    configFile: path.resolve('./test/karma.conf.js'),
    exclude: ['test/angular/unit/**/*.js'],
    preprocessors: {},
    reporters: ['mocha']
  }, done);
}

const runAngularTests = series(runAngularUnitTests, runAngularFunctionalTests);

const runFastTests = series(lintJs, runUnitTests, runAngularTests, runStructureIntegrationTests);

const runAllTests = series(runUnitTests, runAngularTests, runIntegrationTests, lintJs);

function cleanCoverageDir(done) {
  del('coverage/*', done);
}

function generateCoverageReport() {
  var collector = new coverage.Collector(),
    lcov = coverage.Report.create('lcov', {dir: 'coverage'}),
    summary = coverage.Report.create('text');

  return vfs.src('coverage/*.json')
    .pipe(through.obj( (file, enc, done) => {
      collector.add(JSON.parse(file.contents.toString()));
      done();
    }, (callback) => {
      lcov.writeReport(collector);
      summary.writeReport(collector);
      callback();
    }));
}

tasks = {
  'jscs': runJscs,
  'jshint': runJsHint,
  'lint:js': lintJs,
  'test:unit': runUnitTests,
  'test:integration': runIntegrationTests,
  'test:integration:structure': runStructureIntegrationTests,
  'test:angular:unit': runAngularUnitTests,
  'test:angular:functional': runAngularFunctionalTests,
  'test:angular': runAngularTests,
  'test:fast': runFastTests,
  'test': runUnitTests,
  'clean-coverage': cleanCoverageDir,
  'generate-coverage-report': generateCoverageReport
};

module.exports = function registerTasks(gulp) {
  Object.keys(tasks).forEach( (taskName) => {
    gulp.task(taskName, tasks[taskName]);
  });
  return tasks;
};
