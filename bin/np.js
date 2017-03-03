#!/usr/bin/env node
;(function(){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Holds Node-related commands.
var np = {};

// Get version of given package.
np.getVersion = function () {
  var pkg = _fs2.default.readFileSync('package.json');
  return JSON.parse(pkg).version;
};

// Increment the version in the package.json.
np.increment = function (_ref) {
  var version = _ref.version,
      flags = _ref.flags,
      message = _ref.message,
      callback = _ref.callback,
      dryrun = _ref.dryrun;

  flags = flags && flags !== true ? ' ' + flags : '';
  message = message ? ' -m ' + message : '';

  if (!dryrun) {
    _shelljs2.default.exec('npm' + flags + message + ' version ' + version);
  } else {
    console.log('Your package would be updated from ' + np.getVersion() + ' to the next ' + version + ' version.');
  }

  if (callback) {
    callback();
  }

  return np;
};

// Publish the module to the npm public repository.
np.publish = function (tag) {
  _shelljs2.default.exec('npm publish --tag=' + tag);
  return np;
};

exports.default = np;
})();