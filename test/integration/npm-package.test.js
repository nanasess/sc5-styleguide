'use strict';

var fs = require('fs'),
  path = require('path'),
  childProcess = require('child_process'),
  chai = require('chai'),
  Q = require('q'),
  del = require('del'),
  chalk = require('chalk'),
  tmp = require('os').tmpdir(),
  testConfig = require('./test-config'),
  assertions = require('./assertions'),
  currentDir = path.resolve(__dirname),
  styleGuideDir = path.resolve(currentDir, '../../'),
  testDir = path.join(tmp, 'sc5-package-smoketest' + Date.now()),
  sharedSrc = path.resolve(currentDir, '../projects/shared-css/*.css'),
  // Correct the path to match the actual installed directory name
  npmSgDir = path.join(testDir, 'node_modules/nanasess-sc5-styleguide'),
  MINUTE = 60000;

Q.longStackSupport = true;
chai.config.includeStack = true;

describe('style guide generated with npm package executable', function() {

  before(function(done) {
    this.timeout(3 * MINUTE);
    prepareTestDir().then(runNpmInstall).then(done).catch(done);
  });

  after(function() {
    this.timeout(MINUTE);
    deleteTempDir();
  });

  describe('from SCSS test project', function() {
    var output = path.join(testDir, 'scss-test-output'),
      variablesFile = path.resolve(currentDir, '../projects/scss-project/source/styles/_styleguide_variables.scss');

    before(function(done) {
      this.timeout(30000);
      generateScssTestProjectStyleGuide(output, variablesFile).then(done).catch(done);
    });

    checkCommonStructure(output);
    addJsonAssertions(output, variablesFile);
  });

  describe('from LESS test project', function() {
    var output = path.join(testDir, 'less-test-output'),
      variablesFile = path.resolve(currentDir, '../projects/less-project/source/styles/_styleguide_variables.less');

    before(function(done) {
      this.timeout(30000);
      generateLessTestProjectStyleGuide(output, variablesFile).then(done).catch(done);
    });

    checkCommonStructure(output);
    addJsonAssertions(output, variablesFile);
  });

  describe('from plain CSS test project', function() {
    var output = path.join(testDir, 'css-test-output');

    before(function(done) {
      this.timeout(30000);
      generateCssTestProjectStyleGuide(output).then(done).catch(done);
    });

    checkCommonStructure(output);
  });

  describe('from PUG test project', function() {
    var output = path.join(testDir, 'pug-test-output');

    before(function(done) {
      this.timeout(30000);
      generatePugTestProjectStyleGuide(output).then(done).catch(done);
    });

    checkCommonStructure(output);
    addPugAssertions(output);
  });

  describe('from internal client files', function() {
    var output = path.join(testDir, 'demo-test-output');
    before(function(done) {
      this.timeout(30000);
      generateDemoStyleGuide(output).then(done).catch(done);
    });
    checkCommonStructure(output);
  });

});

function prepareTestDir() {
  console.log(chalk.yellow('\n  Creating temp dir', testDir));
  return Q.promise(function(resolve, reject) {
    try {
      fs.mkdirSync(testDir);
      console.log('Successfully created directory:', testDir);
      var sourceFile = path.join(currentDir, 'npm-package-test.json');
      var destFile = path.join(testDir, 'package.json');
      console.log('Copying from', sourceFile, 'to', destFile);
      console.log('Source file exists:', fs.existsSync(sourceFile));
      
      fs.createReadStream(sourceFile)
        .pipe(fs.createWriteStream(destFile))
        .on('close', function() {
          console.log('Successfully wrote package.json');
          resolve();
        })
        .on('error', function(err) {
          console.error('Error writing package.json:', err);
          reject(err.toString());
        });
    } catch (err) {
      console.error('Error in prepareTestDir:', err);
      reject(err.toString());
    }
  });
}

function runNpmInstall() {
  console.log(chalk.yellow('\n  Installing npm module to temp dir from', styleGuideDir));
  var args = ['install', styleGuideDir, '--color', 'false'], // Remove spin, set color false for cleaner logs
    opts = {
      cwd: testDir,
      env: process.env,
      stdio: 'pipe' // Change from 'inherit' to 'pipe' to capture output/error
    };
  console.log(`Running command: npm ${args.join(' ')} in ${testDir}`); // Add logging
  return spawn('npm', args, opts)
    .then(function() {
      console.log('npm install potentially completed (check output/error in spawn).');
      // Add a check here immediately after install
      console.log('Checking existence after install attempt:');
      console.log('testDir:', testDir);
      console.log('npmSgDir:', npmSgDir);
      console.log('npmSgDir exists:', fs.existsSync(npmSgDir));
      // Optionally list directory contents
      try {
        const files = fs.readdirSync(testDir);
        console.log('Contents of testDir:', files);
        const nodeModulesPath = path.join(testDir, 'node_modules');
        if (fs.existsSync(nodeModulesPath)) {
           const nodeModulesFiles = fs.readdirSync(nodeModulesPath);
           console.log('Contents of node_modules:', nodeModulesFiles);
           const installedPackagePath = path.join(nodeModulesPath, 'sc5-styleguide');
           console.log('sc5-styleguide in node_modules exists:', fs.existsSync(installedPackagePath));
        } else {
           console.log('node_modules directory does not exist in testDir.');
        }
      } catch (e) {
        console.error('Error listing directory:', e);
      }
    })
    .catch(function(err) {
      console.error('npm install failed.');
      // The existing spawn function logs error output on failure when stdio is 'pipe'.
      throw err; // Re-throw the error
    });
}

function generateScssTestProjectStyleGuide(output, variablesFile) {
  var args = getSharedConfig();
  args.kssSource = path.resolve(currentDir, '../projects/scss-project/source/**/*.scss');
  args.styleVariables = variablesFile;
  args.output = output;
  args.includeDefaultStyles = false;
  return generateStyleGuide(args);
}

function generateLessTestProjectStyleGuide(output, variablesFile) {
  var args = getSharedConfig();
  args.kssSource = path.resolve(currentDir, '../projects/less-project/source/**/*.less');
  args.styleVariables = variablesFile;
  args.output = output;
  return generateStyleGuide(args);
}

function generateCssTestProjectStyleGuide(output) {
  var args = getSharedConfig();
  args.kssSource = path.resolve(currentDir, '../projects/css-project/source/**/*.css');
  args.output = output;
  return generateStyleGuide(args);
}

function generatePugTestProjectStyleGuide(output) {
  var args = getSharedConfig();
  args.enablePug = true;
  args.kssSource = path.resolve(currentDir, '../projects/pug-project/source/**/*.css');
  args.output = output;
  return generateStyleGuide(args);
}

function generateDemoStyleGuide(output) {
  var args = getSharedConfig();
  // This path should now correctly resolve using the updated npmSgDir
  args.kssSource = path.resolve(npmSgDir, 'lib/app/**/*.scss');
  args.output = output;
  return generateStyleGuide(args);
}

function getSharedConfig() {
  var args = {
    styleSource: sharedSrc
  };

  Object.keys(testConfig).forEach(function(argName) {
    args[argName] = testConfig[argName];
  });
  return args;
}

function generateStyleGuide(args) {
  // Use the executable created by npm in node_modules/.bin
  // This path remains correct as npm handles the bin link regardless of the package dir name
  const styleguideExecutablePath = path.join(testDir, 'node_modules/.bin/styleguide');
  var opts = {
    cwd: testDir, // Run from the temp dir where node_modules is located
    env: process.env,
    stdio: [process.stdin, process.stdout, 'pipe']
  }, argv = [];

  Object.keys(args).forEach(function(argName) {
    var value = args[argName];
    if (value instanceof Array) {
      value.forEach(function(v) {
        argv.push('--' + argName);
        argv.push(v);
      });
    } else {
      argv.push('--' + argName);
      argv.push(value);
    }
  });

  console.log('\n--- generateStyleGuide ---'); // Add separator
  console.log('testDir:', testDir);
  console.log('npmSgDir:', npmSgDir);
  console.log('styleguideExecutablePath:', styleguideExecutablePath);
  console.log('Executing styleguide with arguments:', argv);
  console.log('npmSgDir exists check:', fs.existsSync(npmSgDir)); // Renamed log message slightly
  console.log('Styleguide script exists check:', fs.existsSync(styleguideExecutablePath)); // Renamed log message slightly

  if (!fs.existsSync(styleguideExecutablePath)) {
    console.error(chalk.red('Styleguide script not found at expected path!'));
    // Optionally list directories again for final confirmation
    try {
        console.log('Listing testDir before spawn failure:', fs.readdirSync(testDir));
        const nodeModulesPath = path.join(testDir, 'node_modules');
        if (fs.existsSync(nodeModulesPath)) {
           console.log('Listing node_modules before spawn failure:', fs.readdirSync(nodeModulesPath));
        } else {
           console.log('node_modules directory still does not exist before spawn failure.');
        }
      } catch (e) {
        console.error('Error listing directory before spawn failure:', e);
      }
    return Q.reject(new Error('Styleguide script not found at ' + styleguideExecutablePath));
  }

  // Execute via node command
  const nodeExecutable = process.execPath;
  const spawnArgs = [styleguideExecutablePath].concat(argv);
  // Use node executable to run the script
  return spawn(nodeExecutable, spawnArgs, opts);
}

function deleteTempDir() {
  console.log(chalk.yellow('Cleaning up temp dir', testDir));
  del.sync(path.join(testDir, '*'), { force: true });
  del.sync(testDir, { force: true });
}

function spawn(cmd, args, opts) {
  return Q.promise(function(resolve, reject) {
    var error = '',
      output = '',
      proc = childProcess.spawn(cmd, args, opts),
      readError = function(err) {
        error += err.toString();
      },
      readOutput = function(data) {
        output += data.toString();
      };

    if (proc.stderr) {
      proc.stderr.on('data', readError);
    }
    if (proc.stdout) {
      proc.stdout.on('data', readOutput);
    }
    
    proc.on('error', function(err) {
      console.error('Failed to start process:', err);
      reject(new Error('Failed to start process: ' + err.toString()));
    });
    
    proc.on('exit', function(code, signal) {
      if (code === 0) {
        console.log('Process completed successfully');
        resolve();
      } else {
        var command = [cmd].concat(args).join(' ');
        console.error('Command failed with code:', code);
        console.error('Error output:', error);
        console.error('Standard output:', output);
        reject(new Error('Command exited with non-zero: ' + (code || signal) + '\n' + command + '\n' + error));
      }
    });
  });
}

function checkCommonStructure(outputDir) {
  addAssertions(outputDir, 'index.html', assertions.indexHtml);
  addAssertions(outputDir, 'overview.html', assertions.overviewHtml);
  addAssertions(outputDir, 'styleguide_pseudo_styles.css', assertions.pseudoStyles);
  addAssertions(outputDir, 'styleguide_at_rules.css', assertions.atRules);
  addAssertions(outputDir, 'styleguide.css', assertions.styleguideCss);
}

function addAssertions(dir, fileName, assertion) {
  describe(fileName, function() {
    assertion.register();
    before(function() {
      assertion.set(getFile(dir, fileName));
    });
  });
}

function getFile(dir, fileName) {
  var buffer = fs.readFileSync(path.join(dir, fileName));
  return { contents: buffer };
}

function addJsonAssertions(dir, variablesFile) {
  describe('styleguide.json', function() {
    assertions.styleguideJson.register();
    before(function() {
      assertions.styleguideJson.setJson(getFile(dir, 'styleguide.json'));
      assertions.styleguideJson.setVariablesFile(variablesFile);
    });
  });
}

function addPugAssertions(dir) {
  describe('JSON compilation', function() {
    assertions.pugCompilation.register();
    before(function() {
      assertions.pugCompilation.setJson(getFile(dir, 'styleguide.json'));
    });
  });
}
