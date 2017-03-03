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

// Communicates a dry run.
app.dryrun = ({
  project, msg, oldVersion, currentVersion, pkgPath, gittag, branch
}) => {
  // Updates user.
  console.info(`Dry run complete.`);
  console.info(`You would have published ${project}.`);
  console.info(`Your git message would have read, "${msg}".`);
  console.info(`Your package.json would have been updated from ${oldVersion}
    to ${currentVersion} at ${pkgPath}.`);
  console.info(`The commit would have been tagged ${gittag}.`);
  console.info(`You would have pushed to the branch ${branch}.`);
};

// @TODO Refactor.
app.set = (options, msg, oldVersion) => {
  let currentVersion = np.getVersion(),
    branch = options.branch || app.defaults.branch,
    npmtag = options.npmtag || options.tag || 'next',
    gitmsg,
    gittag,
    pkg = np.getPackage(),
    pkgName = pkg ? pkg.name : undefined,
    pkgPath = np.PKG_PATH,
    project = `${pkgName}@${currentVersion}#${npmtag}`;

  if (!pkgName) {
    console.warn('We are unable to find a package.json for this project. ' +
      'Exiting ...');
    return app;
  }

  msg += ' to v' + currentVersion + '."';

  // Set the values requiring knowledge of new version.
  gitmsg = options.gitmsg || msg;
  gittag = options.gittag || 'v' + currentVersion;

  if (!options.dryrun) {
    // Executes Git publishing process.
    gi.add(pkgPath).commit(msg).tag(gittag, gitmsg).push(branch);

    // Executes npm publishing process.
    np.publish(npmtag);

    // Updates user.
    console.info(`Done! You've published ${project}.`);
  } else {
    app.dryrun({
      project, msg, oldVersion, currentVersion, pkgPath, gittag, branch
    });
  }

  return app;
};

app.pwd = (args, callback) => {
  const pwd = shell.pwd();
  console.info(pwd);

  // In CLI, returns user to application.
  callback();
};

app.version = function(args, callback) {
  const version = np.getVersion();
  console.info(version);

  // In CLI, returns user to application.
  callback();
};

app.publish = (args, callback) => {
  // Validates.
  app.init();

  // Empowers API users to set their args outside an options object.
  let options = app.getOptions(args),
    version = options.version || app.defaults.v,
    pkg = np.getPackage(),
    currentVersion = np.getVersion(),
    pkgName = pkg ? pkg.name : undefined,
    msg = options.dryrun ? 'DRYRUN: ' : '';

  if (!pkgName) {
    console.warn('We are unable to find a package.json for this project. ' +
      'Exiting ...');

    // In CLI, returns user to application.
    callback();

    return app;
  }

  console.log(msg + 'Publish ' + version + ' update to ' + pkgName + '@' + currentVersion + '.');

  // Starts building the message.
  msg = '"Increments from v' + currentVersion;

  // Increments node module version. Does not git tag nor git commit.
  np.increment({
    callback: () => {
      // Send old version to `set` method.
      app.set(options, msg, currentVersion);

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
