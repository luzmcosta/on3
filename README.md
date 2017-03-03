on3 simplifies common workflows for managing a Node module under Git version control. Increment your Node module's version, commit, push to GitHub, and publish to npm in one command.

```
npm install -g on3
```

Submit your pull requests and feedback to [GitHub](https://github.com/luzmcosta/on3/issues).

# API
**publish**  
`on3.publish(args: {}, callback: fn)`  

`branch` {str} The branch to push. This is set to "master" by default.  
`gittag` {str} By default, this is a "v" followed by the package version in package.json, e.g. "v1.0.0-0".  
`gitmsg` {str} Sets the Git commit message.  
`npmtag` {str} The tag to apply when executing `npm publish`. This is set to "next" by default so publishing to the "latest" tag is a conscious decision. This should mitigate the risk of accidentally releasing breaking changes.  
`version` {str} Any value valid to [`npm version`](https://docs.npmjs.com/cli/version). This is set to "prepatch" by default.  
`dryrun` Report the would-be changes without executing them.

**increment**  
`on3.increment(args: {}, callback: fn)`  

`message` {str} Sets the Git commit message.  
`flag` {str} Sets the flags to pass to `npm version`.  
`only` {bool} If true, increments the version without committing the changes.  
`version` {str} Any value valid to [`npm version`](https://docs.npmjs.com/cli/version). This is set to "prepatch" by default.  
`--dryrun` Report the would-be changes without executing them.

# CLI

```shell
# Example
on3 # alias: on
publish -v patch -n latest
```

**publish** _[alias: p]_ Increments the package's version, commits as instructed, then pushes and publishes the package.

  `publish -b master -v prepatch -g v1.0.1 -n next -m "Increments from v1.0.1-0 to v1.0.1-1."`

`-b, --branch [branch]` Sets which branch to push to GitHub. Defaults to master.  
`-g, --gittag [tag]` Tags the Git commit. The new version number is used by default.  
`-m, --gitmsg ["message"]` Sets the Git commit message. Wrapping your comment in double quotes is recommended.  
`-n, --npmtag [tag]` Tags the node module. This is set as "next" by default so releasing as "latest" is a conscious choice.  
`-v, --version [version]` Increments the package to the given version. Uses "prepatch" by default.  
`--dryrun` Report the would-be changes without executing them.

**increment** Increments the package version, commits the changes, and tags the commit with the new version number. See `-o` to avoid the latter two steps.

  `increment -m "Your Git commit message here."`  
  `increment -f "--no-git-tag-version -f"`  

`-f, --flags` Sets the flags on the `npm version` command.  
`-m, --message` Sets the git commit message.  
`-o, --only` Ignore your repo's status, and do not commit. Only update the version in package.json.  
`--dryrun` Report the would-be changes without executing them.

# Contributing
Submit your pull requests and feedback to [GitHub](https://github.com/luzmcosta/on3/issues).

## Engineering Tasks (@todo)
- Improve the user experience with better, colored feedback
- Write command to commit + increment
- Async execution where possible
- Commit a bundle and point index.js to it
- Improve test coverage
- Consider other pains in managing a Node module

## Development Guidelines

### eslint
`npm run lint`

## Testing
`npm run build && node build/test.js`

##  Dependencies
Developers contributing to this project require the tools that support it:

* [ShellJS](https://www.npmjs.com/package/shelljs)
* [Vorpal](https://www.npmjs.com/package/vorpal)

* [Babel](https://babeljs.io/)
* [ESLint](http://eslint.org/)

* [Node and npm](http://nodejs.org/): Node provides an environment on which to execute JavaScript processes, while npm manages packages.
