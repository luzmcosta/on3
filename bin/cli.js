#!/usr/bin/env node
;(function(){
'use strict';

var _vorpal = require('vorpal');

var _vorpal2 = _interopRequireDefault(_vorpal);

var _shelljs = require('shelljs');

var _shelljs2 = _interopRequireDefault(_shelljs);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cli = (0, _vorpal2.default)();

// Updates the package version, tags the commit, pushes, and publishes.
cli.command('publish', 'Publishes the package to GitHub and npm.').alias('p').option('-b, --branch [branch]', 'Set the branch to push to GitHub.').option('-g, --gittag [tag]', 'Tag the Git commit.').option('-m, --gitmsg [msg]', 'Set the Git commit message.').option('-n, --npmtag [tag]', 'Tag the node module.').option('-v, --version [version]', 'Increment to the given version.').option('--dryrun', 'Report the would-be changes without executing them.').action(_app2.default.publish);

// Increment the node module's version.
cli.command('increment [version]', 'Increment the npm version.').option('-m, --message [msg]', 'Sets the git commit message.').option('-f, --flag [flags]', 'Sets the flags on the `npm version` command.').option('-o, --only', 'Does not commit nor tag after updating the npm version.').option('-v, --version', 'Sets the version.').option('--dryrun', 'Report the would-be changes without executing them.').action(_app2.default.increment);

// Set the prompt.
cli.delimiter('on >>').show();
})();