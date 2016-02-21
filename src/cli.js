import vorpal from 'vorpal';
import shell from 'shelljs';
import app from '../build/app';

let cli = vorpal();

// Updates the package version, tags the commit, pushes, and publishes.
cli.
command('publish', 'Publishes the package to GitHub and npm.').
alias('p').
option('-b, --branch [branch]', 'Set the branch to push to GitHub.').
option('-g, --gittag [tag]', 'Tag the Git commit.').
option('-m, --gitmsg [msg]', 'Set the Git commit message.').
option('-n, --npmtag [tag]', 'Tag the node module.').
option('-v, --version [version]', 'Increment to the given version.').
option('--dryrun', 'Report the would-be changes without executing them.').
action(app.publish);

// Increment the node module's version.
cli.
command('increment [version]', 'Increment the npm version.').
option('-m, --message [msg]', 'Sets the git commit message.').
option('-f, --flag [flags]', 'Sets the flags on the `npm version` command.').
option('-o, --only', 'Does not commit nor tag after updating the npm version.').
option('-v, --version', 'Sets the version.').
option('--dryrun', 'Report the would-be changes without executing them.').
action(app.increment);

// Set the prompt.
cli.delimiter('on >>').show();
