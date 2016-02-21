import shell from 'shelljs';
import np from './np';
import gi from './gi';

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

app.publish = (args, callback) => {
  // Empowers API users to set their args outside an options object.
  let options = app.getOptions(args);

  // Validates.
  app.init();

  let branch = options.branch || app.defaults.branch,
    version = options.version || app.defaults.v,
    currentVersion = np.getVersion(),
    msg, gitmsg, gittag, npmtag;

  console.log('Publishing package. Current version: ' + currentVersion + '.');

  // Starts building the message.
  msg = '"Increments from v' + currentVersion;

  // Increments node module version. Does not git tag nor git commit.
  np.increment(version, app.flags.increment);

  // Sets the values requiring knowledge of new version.
  currentVersion = np.getVersion();
  msg += ' to v' + currentVersion + '."';
  gitmsg = options.gitmsg || msg;
  gittag = options.gittag || 'v' + currentVersion;
  npmtag = options.npmtag || options.tag || 'next';

  // Executes Git publishing process.
  gi.add('package.json').commit(msg).tag(gittag, gitmsg).push(branch);

  // Executes npm publishing process.
  np.publish(npmtag);

  // Updates user.
  console.log(`${pkg.name}@${currentVersion} #${npmtag} has been published.`);

  // Returns user to our application rather than exit.
  callback();

  return app;
};

app.increment = (args, callback) => {
  // Empowers API users to set their args outside an options object.
  let options = app.getOptions(args),
      flags = options.flag;

  if (options.only) {
    flags = app.flags.increment;
  }

  np.increment(options.version || app.defaults.v, flags, options.message);

  callback();

  return app;
};

export default app;
