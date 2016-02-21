'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Holds Git-related commands.
var gi = {};

// Confirm this is a Git repository.
gi.is = function () {
  if (!_shelljs2.default.which('git')) {
    _shelljs2.default.echo(app.errors.nogit);
    return false;
  }

  return true;
};

gi.add = function (file) {
  _shelljs2.default.exec('git add ' + file);
  return gi;
};

gi.commit = function (msg) {
  _shelljs2.default.exec('git commit -m ' + msg);
  return gi;
};

gi.push = function (branch) {
  _shelljs2.default.exec('git push origin ' + branch);
  return gi;
};

gi.tag = function (tag, msg) {
  _shelljs2.default.exec('git tag ' + tag + ' -m ' + msg);
  return gi;
};

exports.default = gi;