import fs from 'fs';
import pkg from '../package.json';

let
transformer = {
  template: {
    node: (code, moduleName) => {
      return code + '\nexport default ' + moduleName + ';';
    },
    // Wrap code in the #! and IIFE of node executables.
    cli: (code) => {
      return `#!/usr/bin/env node\n;(function(){\n${code}\n})();`;
    }
  }
};

// Executes the full workflow: from getting the src code to writing a new file.
transformer.set = ({fileName, file, pkg, type}) => {
  if (/node/.test(type)) {
    file = transformer.template.node(file, type.split(':')[1]);
  }

  transformer.write(fileName,
    transformer.prepare(transformer.get(file, pkg), type));
  return transformer;
};

// Transform w/ Babel into CommonJS format for Node.
transformer.get = (code, pkg) => {
  // @note One reason I'm using require here: babel-core fails w/ `import`.
  return require('babel-core').transform(code, pkg.babel).code;
};

// Returns code wrapped in template type indicates.
transformer.prepare = (code, type) => {
  if (type === 'cli') {
    if (transformer.template[type]) {
      return transformer.template[type](code);
    }
    console.log('WARNING: Invalid type "' + type + '" entered.');
  }
  return code;
};

// Write file to system.
transformer.write = (fileName, code) => {
  fs.writeFile(fileName, code, (err) => {
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
transformer.exec = (src, output, type) => {
  // Get contents of cli.js.
  fs.readFile(src, (err, data) => {
    if (err) {
      throw err;
    }

    // Transform code & write to file.
    transformer.set({fileName: output, file: data.toString(), pkg, type});
  });
};

export default transformer;
