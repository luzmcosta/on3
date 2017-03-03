#!/usr/bin/env node
;(function(){
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
    /**
     * Wrap code to create a node module.
     *
     * @param {str} code The module's code. import statements should be here.
     * @param {str} moduleName The name of the module to export.
     * @return {str} An ES6 module.
     */
    node: function node(code, moduleName) {
      if (/export default/.test(code)) {
        return code;
      }
      return code + '\nexport default ' + moduleName + ';';
    },

    /**
     * Wrap code to create a node executable.
     *
     * @param {str} code
     * @return {str}
     */
    cli: function cli(code) {
      return '#!/usr/bin/env node\n;(function(){\n' + code + '\n})();';
    }
  }
};

/**
 * Executes the full workflow: from getting the src code to writing a new file.
 *
 * @param {obj} src File name of source file.
 *        {str} fileName File name of intended output file.
 *        {str} code The output file's intended content.
 *        {obj} pkg An object containing the Babel configuration.
 *        {str} type The kind of file we're building. ["cli", "node:moduleName"]
 * @return {obj} transformer
 */
transformer.set = function (_ref) {
  var fileName = _ref.fileName,
      code = _ref.code,
      pkg = _ref.pkg,
      type = _ref.type;

  if (/node/.test(type)) {
    code = transformer.template.node(code, type.split(':')[1]);
  }

  transformer.write(fileName, transformer.prepare(transformer.get(code, pkg), type));

  return transformer;
};

/**
 * Uses Babel to transform code into the CommonJS format for Node.
 *
 * @param {str} code The ESNext code to parse.
 * @param {obj} pkg An object containing the Babel configuration.
 * @return {str} ES5-valid code
 */
transformer.get = function (code, pkg) {
  // @note One reason I'm using require here: babel-core fails w/ `import`.
  return require('babel-core').transform(code, pkg.babel).code;
};

/**
 * Returns code wrapped in the template the type variable indicates.
 *
 * @param {str} code Code to parse.
 * @param {str} type The kind of file we're building. ["cli", "node:moduleName"]
 * @return {str} If type is "cli," code is wrapped to create a node executable.
 */
transformer.prepare = function (code, type) {
  if (type === 'cli') {
    if (transformer.template[type]) {
      return transformer.template[type](code);
    }

    console.log('WARNING: Invalid type "' + type + '" entered.');
  }

  return code;
};

/**
 * Write file to system.
 *
 * @param {str} fileName The name of the output file.
 * @param {str} code The contents of the output file.
 * @return {obj} transformer
 */
transformer.write = function (fileName, code) {
  _fs2.default.writeFile(fileName, code, function (err) {
    if (err) {
      throw err;
    }

    console.log('Built ' + fileName + '.');
    return true;
  });

  return transformer;
};

transformer.getFile = function (output, type) {
  return function (err, data) {
    if (err) {
      throw err;
    }

    // Transform code & write to file.
    transformer.set({ fileName: output, code: data.toString(), pkg: _package2.default, type: type });

    return data;
  };
};

/**
 * Transforms an ES6 file into an executable.
 *
 * @param {str} src File name of source file.
 * @param {str} output File name of intended output file.
 * @param {str} type The kind of file we're building. ["cli", "node:moduleName"]
 * @return {obj} transformer
 */
transformer.exec = function (src, output, type) {
  // Determine whether we're handling a file or a directory.
  var isFile = /[\/|.]\w*/.test(src);

  // If directory, loop through files.
  if (!isFile) {
    // Get the source directory.
    _fs2.default.readdir(src, function (err, files) {
      files.forEach(function (fileName) {
        var filePath = src + '/' + fileName,
            outputFile = output + '/' + fileName;

        console.log('CONVERT >> ', filePath, '->', outputFile);

        _fs2.default.readFile(filePath, transformer.getFile(outputFile, type));
      });
    });
  } else {
    // Get file contents.
    _fs2.default.readFile(src, transformer.getFile(output, type));
  }

  return transformer;
};

exports.default = transformer;
})();