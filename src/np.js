import shell from 'shelljs';

// Holds Node-related commands.
let np = {};

// Get version of given package.
np.getVersion = () => {
  return require('../package.json').version;
};

// Increment the version in the package.json.
np.increment = (version, flags, message) => {
  flags = flags && flags !== true ? ' ' + flags : '';
  message = message ? ' -m ' + message : '';
  shell.exec('npm' + flags + message + ' version ' + version);
  return np;
};

// Publish the module to the npm public repository.
np.publish = (tag) => {
  shell.exec('npm publish --tag=' + tag);
  return np;
};

export default np;
