import fs from 'fs';
import shell from 'shelljs';
import np from './np';
import gi from './gi';

const PKG = np.getPackage();

let app = {
  defaults: {
    branch: 'master',
    v: 'prepatch',
  },
  errors: {
    nogit: 'This script requires git. Consider executing `git init`.',
  },
  flags: {
    increment: '--no-git-tag-version -f',
  },
};

app.init = function() {
  if (!gi.is()) {
    shell.exit(1);
  }

  this.package = PKG;

  return this;
};

// Gets options passed.
app.getOptions = (args) => {
  return args.options ? args.options : args;
};

app.set = (options, msg) => {
  let currentVersion = np.getVersion(),
    branch = options.branch || app.defaults.branch,
    npmtag = options.npmtag || options.tag || 'next',
    gitmsg,
    gittag,
    pkg = np.getPackage(),
    pkgName = pkg.name,
    pkgPath = np.PKG_PATH;

  msg += ' to v' + currentVersion + '."';

  // Set the values requiring knowledge of new version.
  gitmsg = options.gitmsg || msg;
  gittag = options.gittag || 'v' + currentVersion;

  if (!options.dryrun) {
    // Executes Git publishing process.
    gi.add(pkgPath).commit(msg).tag(gittag, gitmsg).push(branch);

    // Executes npm publishing process.
    np.publish(npmtag);
  }

  // Updates user.
  console.log(`${pkgName}@${currentVersion} #${npmtag} has been published.`);

  return app;
};

app.pwd = () => {
  const pwd = shell.pwd();
  console.info(pwd);
  return app;
};

app.version = function() {
  const version = np.getVersion();
  console.info(version);
  return app;
};

app.publish = (args, callback) => {
  // Validates.
  app.init();

  // Empowers API users to set their args outside an options object.
  let options = app.getOptions(args),
    version = options.version || app.defaults.v,
    pkg = np.getPackage(),
    currentVersion = np.getVersion(),
    pkgName = pkg.name,
    msg = options.dryrun ? 'DRYRUN: ' : '';

  console.log(msg + 'Publish ' + version + ' update to ' + pkgName + '@' + currentVersion + '.');

  // Starts building the message.
  msg = '"Increments from v' + currentVersion;

  // Increments node module version. Does not git tag nor git commit.
  np.increment({
    callback: () => {
      app.set(options, msg);

      // In CLI, returns user to our application rather than exit.
      // In API, this can be anything to which the user sets it.
      callback();
    },

    dryrun: options.dryrun,
    flags: app.flags.increment,
    message: undefined,
    version,
  });

  return app;
};

app.increment = (args, callback) => {
  // Empowers API users to set their args outside an options object.
  let options = app.getOptions(args),
    flags = options.flag;

  if (options.only) {
    flags = app.flags.increment;
  }

  // In CLI, the callback returns the user to our application.
  np.increment({
    callback,
    dryrun: options.dryrun,
    flags,
    message: options.message,
    version: options.version || app.defaults.v,
  });

  return app;
};

export default app;
