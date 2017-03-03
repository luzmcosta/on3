import shell from 'shelljs';
import fs from 'fs';

const PWD = shell.pwd();
const PKG_PATH = PWD + '/package.json';

// Holds Node-related commands.
let np = {PWD, PKG_PATH};

np.getPackage = (path=PKG_PATH) => {
  let pkg = fs.readFileSync(path);
  if (pkg) {
    return JSON.parse(pkg);
  } else {
    console.warn(`We were unable to retrieve the package.json at ${path}`);
  }
};

// Get version of given package.
np.getVersion = (pkg=np.getPackage()) => {
  return pkg.version;
};

// Increment the version in the package.json.
np.increment = ({version, flags, message, callback, dryrun}) => {
  flags = flags && flags !== true ? ' ' + flags : '';
  message = message ? ' -m ' + message : '';

  if (!dryrun) {
    shell.exec('npm' + flags + message + ' version ' + version);
  } else {
    console.log('Your package would be updated from ' + np.getVersion() +
      ' to the next ' + version + ' version.');
  }

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
