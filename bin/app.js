#!/usr/bin/env node
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _np = require('./np');

var _np2 = _interopRequireDefault(_np);

var _gi = require('./gi');

var _gi2 = _interopRequireDefault(_gi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PKG = _np2.default.getPackage();

var app = {
  defaults: {
    branch: 'master',
    v: 'prepatch'
  },
  errors: {
    nogit: 'This script requires git. Consider executing `git init`.'
  },
  flags: {
    increment: '--no-git-tag-version -f'
  }
};

app.init = function () {
  if (!_gi2.default.is()) {
    _shelljs2.default.exit(1);
  }

  this.package = PKG;

  return this;
};

// Gets options passed.
app.getOptions = function (args) {
  return args.options ? args.options : args;
};

// Communicates a dry run.
app.dryrun = function (_ref) {
  var project = _ref.project,
      msg = _ref.msg,
      oldVersion = _ref.oldVersion,
      currentVersion = _ref.currentVersion,
      pkgPath = _ref.pkgPath,
      gittag = _ref.gittag,
      branch = _ref.branch;

  // Updates user.
  console.info('Dry run complete.');
  console.info('You would have published ' + project + '.');
  console.info('Your git message would have read, "' + msg + '".');
  console.info('Your package.json would have been updated from ' + oldVersion + '\n    to ' + currentVersion + ' at ' + pkgPath + '.');
  console.info('The commit would have been tagged ' + gittag + '.');
  console.info('You would have pushed to the branch ' + branch + '.');
};

// @TODO Refactor.
app.set = function (options, msg, oldVersion) {
  var currentVersion = _np2.default.getVersion(),
      branch = options.branch || app.defaults.branch,
      npmtag = options.npmtag || options.tag || 'next',
      gitmsg = void 0,
      gittag = void 0,
      pkg = _np2.default.getPackage(),
      pkgName = pkg ? pkg.name : undefined,
      pkgPath = _np2.default.PKG_PATH,
      project = pkgName + '@' + currentVersion + '#' + npmtag;

  if (!pkgName) {
    console.warn('We are unable to find a package.json for this project. ' + 'Exiting ...');
    return app;
  }

  msg += ' to v' + currentVersion + '."';

  // Set the values requiring knowledge of new version.
  gitmsg = options.gitmsg || msg;
  gittag = options.gittag || 'v' + currentVersion;

  if (!options.dryrun) {
    // Executes Git publishing process.
    _gi2.default.add(pkgPath).commit(msg).tag(gittag, gitmsg).push(branch);

    // Executes npm publishing process.
    _np2.default.publish(npmtag);

    // Updates user.
    console.info('Done! You\'ve published ' + project + '.');
  } else {
    app.dryrun({
      project: project, msg: msg, oldVersion: oldVersion, currentVersion: currentVersion, pkgPath: pkgPath, gittag: gittag, branch: branch
    });
  }

  return app;
};

app.pwd = function (args, callback) {
  var pwd = _shelljs2.default.pwd();
  console.info(pwd);

  // In CLI, returns user to application.
  callback();
};

app.version = function (args, callback) {
  var version = _np2.default.getVersion();
  console.info(version);

  // In CLI, returns user to application.
  callback();
};

app.publish = function (args, _callback) {
  // Validates.
  app.init();

  // Empowers API users to set their args outside an options object.
  var options = app.getOptions(args),
      version = options.version || app.defaults.v,
      pkg = _np2.default.getPackage(),
      currentVersion = _np2.default.getVersion(),
      pkgName = pkg ? pkg.name : undefined,
      msg = options.dryrun ? 'DRYRUN: ' : '';

  if (!pkgName) {
    console.warn('We are unable to find a package.json for this project. ' + 'Exiting ...');

    // In CLI, returns user to application.
    _callback();

    return app;
  }

  console.log(msg + 'Publish ' + version + ' update to ' + pkgName + '@' + currentVersion + '.');

  // Starts building the message.
  msg = '"Increments from v' + currentVersion;

  // Increments node module version. Does not git tag nor git commit.
  _np2.default.increment({
    callback: function callback() {
      // Send old version to `set` method.
      app.set(options, msg, currentVersion);

      // In CLI, returns user to our application rather than exit.
      // In API, this can be anything to which the user sets it.
      _callback();
    },

    dryrun: options.dryrun,
    flags: app.flags.increment,
    message: undefined,
    version: version
  });

  return app;
};

app.increment = function (args, callback) {
  // Empowers API users to set their args outside an options object.
  var options = app.getOptions(args),
      flags = options.flag;

  if (options.only) {
    flags = app.flags.increment;
  }

  // In CLI, the callback returns the user to our application.
  _np2.default.increment({
    callback: callback,
    dryrun: options.dryrun,
    flags: flags,
    message: options.message,
    version: options.version || app.defaults.v
  });

  return app;
};

exports.default = app;
})();