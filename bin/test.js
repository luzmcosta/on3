'use strict';

var _app = require('./app.js');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('on3 ', _app2.default);

_app2.default.increment({ flag: '', gitmsg: "This is a test." }, function () {
  return;
});
_app2.default.publish({ gitmsg: "This is also a test." }, function () {
  return;
});