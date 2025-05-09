'use strict';

var vfs = require('vinyl-fs'),
  path = require('path'),
  plumber = require('gulp-plumber'),
  jshint = require('gulp-jshint'),
  mocha = require('gulp-mocha'),
  through = require('through2'),
  { series, parallel } = require('gulp'),
  { deleteSync } = require('del'),
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

function runJsHint() {
  return srcJsLint()
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
}

const lintJs = runJsHint;

function runMocha() {
  return mocha({reporter: 'spec'});
}

function runUnitTests() {
  return vfs.src(['test/unit/**/*.js']).pipe(runMocha());
}

function runStructureIntegrationTests() {
  return vfs.src(['test/integration/**/*.js', '!test/integration/npm-package.test.js']).pipe(runMocha());
}

function runIntegrationTests() {
  return vfs.src('test/integration/**/*.js').pipe(runMocha());
}

const runFastTests = series(lintJs, runUnitTests, runStructureIntegrationTests);

const runAllTests = series(runUnitTests, runIntegrationTests, lintJs);

tasks = {
  'jshint': runJsHint,
  'lint:js': lintJs,
  'test:unit': runUnitTests,
  'test:integration': runIntegrationTests,
  'test:integration:structure': runStructureIntegrationTests,
  'test:fast': runFastTests,
  'test': runUnitTests
};

module.exports = function registerTasks(gulp) {
  Object.keys(tasks).forEach( (taskName) => {
    gulp.task(taskName, tasks[taskName]);
  });
  return tasks;
};
