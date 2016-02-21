import shell from 'shelljs';
import fs from 'fs';

// Holds Node-related commands.
let np = {};

// Get version of given package.
np.getVersion = () => {
  let pkg = fs.readFileSync('../package.json');
  return JSON.parse(pkg).version;
};

// Increment the version in the package.json.
np.increment = (version, flags, message, callback) => {
  flags = flags && flags !== true ? ' ' + flags : '';
  message = message ? ' -m ' + message : '';

  shell.exec('npm' + flags + message + ' version ' + version);

  if (callback) {
    callback();
  }

  return np;
};

// Publish the module to the npm public repository.
np.publish = (tag) => {
  shell.exec('npm publish --tag=' + tag);
  return np;
};

export default np;
