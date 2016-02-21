'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Holds Node-related commands.
var np = {};

// Get version of given package.
np.getVersion = function (pkg) {
  return pkg.version;
};

// Increment the version in the package.json.
np.increment = function (version, flags, message) {
  flags = flags && flags !== true ? ' ' + flags : '';
  message = message ? ' -m ' + message : '';
  _shelljs2.default.exec('npm' + flags + message + ' version ' + version);
  return np;
};

// Publish the module to the npm public repository.
np.publish = function (tag) {
  _shelljs2.default.exec('npm publish --tag=' + tag);
  return np;
};

exports.default = np;