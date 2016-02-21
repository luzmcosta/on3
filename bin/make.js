'use strict';

var _transformer = require('./transformer');

var _transformer2 = _interopRequireDefault(_transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_transformer2.default.exec('src/cli.js', 'bin/cli.js', 'cli');
_transformer2.default.exec('src/cli.js', 'build/cli.js', 'node:app');