import shell from 'shelljs';
import np from './np';
import gi from './gi';
import pkg from '../package.json';

let app = Object.create({
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
});

app.init = () => {
  if (!gi.is()) {
    shell.exit(1);
  }

  return app;
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
    gittag;

  msg += ' to v' + currentVersion + '."';

  // Set the values requiring knowledge of new version.
  gitmsg = options.gitmsg || msg;
  gittag = options.gittag || 'v' + currentVersion;

  if (!options.dryrun) {
    // Executes Git publishing process.
    gi.add('package.json').commit(msg).tag(gittag, gitmsg).push(branch);

    // Executes npm publishing process.
    np.publish(npmtag);
  }

  // Updates user.
  console.log(`${pkg.name}@${currentVersion} #${npmtag} has been published.`);

  return app;
};

app.publish = (args, callback) => {
  // Validates.
  app.init();

  // Empowers API users to set their args outside an options object.
  let options = app.getOptions(args),
    version = options.version || app.defaults.v,
    currentVersion = np.getVersion(),
    msg = options.dryrun ? 'DRYRUN: ' : '';

  console.log(msg + 'Publish ' + version + ' update to ' + pkg.name + '@' + currentVersion + '.');

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
