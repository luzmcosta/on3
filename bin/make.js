#!/usr/bin/env node
;(function(){
'use strict';

var _transformer = require('./transformer');

var _transformer2 = _interopRequireDefault(_transformer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_transformer2.default.exec('src', 'bin', 'cli');
_transformer2.default.exec('src', 'build', 'node:app');
})();