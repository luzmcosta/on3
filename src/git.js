import shell from 'shelljs';

// Holds Git-related commands.
let gi = {};

// Confirm this is a Git repository.
gi.is = () => {
  if (!shell.which('git')) {
    shell.echo(app.errors.nogit);
    return false;
  }

  return true;
};

gi.add = (file) => {
  shell.exec('git add ' + file);
  return gi;
};

gi.commit = (msg) => {
  shell.exec('git commit -m ' + msg);
  return gi;
};

gi.push = (branch) => {
  shell.exec('git push origin ' + branch);
  return gi;
};

gi.tag = (tag, msg) => {
  shell.exec('git tag ' + tag + ' -m ' + msg);
  return gi;
};

export default gi;
