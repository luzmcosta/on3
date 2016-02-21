'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var transformer = {
  template: {
    node: function node(code, moduleName) {
      return code + '\nexport default ' + moduleName + ';';
    },
    // Wrap code in the #! and IIFE of node executables.
    cli: function cli(code) {
      return '#!/usr/bin/env node\n;(function(){\n' + code + '\n})();';
    }
  }
};

// Executes the full workflow: from getting the src code to writing a new file.
transformer.set = function (_ref) {
  var fileName = _ref.fileName;
  var file = _ref.file;
  var pkg = _ref.pkg;
  var type = _ref.type;

  if (/node/.test(type)) {
    file = transformer.template.node(file, type.split(':')[1]);
  }

  transformer.write(fileName, transformer.prepare(transformer.get(file, pkg), type));
  return transformer;
};

// Transform w/ Babel into CommonJS format for Node.
transformer.get = function (code, pkg) {
  // @note One reason I'm using require here: babel-core fails w/ `import`.
  return require('babel-core').transform(code, pkg.babel).code;
};

// Returns code wrapped in template type indicates.
transformer.prepare = function (code, type) {
  if (type === 'cli') {
    if (transformer.template[type]) {
      return transformer.template[type](code);
    }
    console.log('WARNING: Invalid type "' + type + '" entered.');
  }
  return code;
};

// Write file to system.
transformer.write = function (fileName, code) {
  _fs2.default.writeFile(fileName, code, function (err) {
    if (err) {
      throw err;
    }

    console.log('Built ' + fileName + '.');
    return true;
  });
};

/**
 * Transforms an ES6 file into an executable.
 *
 * @param {str} src File name of source file.
 * @param {str} output File name of intended output file.
 */
transformer.exec = function (src, output, type) {
  // Get contents of cli.js.
  _fs2.default.readFile(src, function (err, data) {
    if (err) {
      throw err;
    }

    // Transform code & write to file.
    transformer.set({ fileName: output, file: data.toString(), pkg: _package2.default, type: type });
  });
};

exports.default = transformer;