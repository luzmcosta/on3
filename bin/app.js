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

var pwd = _shelljs2.default.pwd();

console.log('Current working directory.', pwd);

var pkg = _fs2.default.readFileSync(pwd + 'package.json');

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

  return app;
};

// Gets options passed.
app.getOptions = function (args) {
  return args.options ? args.options : args;
};

app.set = function (options, msg) {
  var currentVersion = _np2.default.getVersion(),
      branch = options.branch || app.defaults.branch,
      npmtag = options.npmtag || options.tag || 'next',
      gitmsg = void 0,
      gittag = void 0;

  msg += ' to v' + currentVersion + '."';

  // Set the values requiring knowledge of new version.
  gitmsg = options.gitmsg || msg;
  gittag = options.gittag || 'v' + currentVersion;

  if (!options.dryrun) {
    // Executes Git publishing process.
    _gi2.default.add('package.json').commit(msg).tag(gittag, gitmsg).push(branch);

    // Executes npm publishing process.
    _np2.default.publish(npmtag);
  }

  // Updates user.
  console.log(pkg.name + '@' + currentVersion + ' #' + npmtag + ' has been published.');

  return app;
};

app.pwd = function () {
  return _shelljs2.default.pwd();
};

app.version = function () {
  return _np2.default.getVersion();
};

app.publish = function (args, _callback) {
  // Validates.
  app.init();

  // Empowers API users to set their args outside an options object.
  var options = app.getOptions(args),
      version = options.version || app.defaults.v,
      currentVersion = _np2.default.getVersion(),
      msg = options.dryrun ? 'DRYRUN: ' : '';

  console.log(msg + 'Publish ' + version + ' update to ' + pkg.name + '@' + currentVersion + '.');

  // Starts building the message.
  msg = '"Increments from v' + currentVersion;

  // Increments node module version. Does not git tag nor git commit.
  _np2.default.increment({
    callback: function callback() {
      app.set(options, msg);

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