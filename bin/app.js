'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _np = require('./np');

var _np2 = _interopRequireDefault(_np);

var _gi = require('./gi');

var _gi2 = _interopRequireDefault(_gi);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = Object.create({
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
});

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

app.publish = function (args, callback) {
  // Empowers API users to set their args outside an options object.
  var options = app.getOptions(args);

  // Validates.
  app.init();

  var branch = options.branch || app.defaults.branch,
      version = options.version || app.defaults.v,
      currentVersion = _np2.default.getVersion(_package2.default),
      msg = undefined,
      gitmsg = undefined,
      gittag = undefined,
      npmtag = undefined;

  console.log('Publishing package. Current version: ' + currentVersion + '.');

  // Starts building the message.
  msg = '"Increments from v' + currentVersion;

  // Increments node module version. Does not git tag nor git commit.
  _np2.default.increment(version, app.flags.increment);

  // Sets the values requiring knowledge of new version.
  currentVersion = _np2.default.getVersion(require('../package.json'));
  msg += ' to v' + currentVersion + '."';
  gitmsg = options.gitmsg || msg;
  gittag = options.gittag || 'v' + currentVersion;
  npmtag = options.npmtag || options.tag || 'next';

  // Executes Git publishing process.
  _gi2.default.add('package.json').commit(msg).tag(gittag, gitmsg).push(branch);

  // Executes npm publishing process.
  _np2.default.publish(npmtag);

  // Updates user.
  console.log(_package2.default.name + '@' + currentVersion + ' #' + npmtag + ' has been published.');

  // Returns user to our application rather than exit.
  callback();

  return app;
};

app.increment = function (args, callback) {
  // Empowers API users to set their args outside an options object.
  var options = app.getOptions(args),
      flags = options.flag;

  if (options.only) {
    flags = app.flags.increment;
  }

  _np2.default.increment(options.version || app.defaults.v, flags, options.message);

  callback();

  return app;
};

exports.default = app;