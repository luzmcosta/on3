import shell from 'shelljs'
import { errors } from './errors.js'

// Holds Git-related commands.
export const git = {}

/**
 * Confirm Git is available.
 * @return {boolean}
 */
git.isAvailable = () => {
  return shell.which('git')
}

/**
 * Confirm the given directory is a Git repository.
 * @param {String} path The path to the repository.
 * @return {boolean}
 */
git.isPackage = (path = '.') => {
  const { code } = shell.exec(`git -C ${path} rev-parse 2>/dev/null`, { silent: true })

  return code === 0
}

/**
 * Add a file to the Git staging area.
 * @param {String} filePath The path to the file to add, relative to the root of the repository.
 * @return {Object} Returns the git object for chaining.
 */
git.add = (filePath) => {
  shell.exec('git add ' + filePath)
  return git
}

/**
 * Commit the staged files.
 * @param {String} msg The commit message. It should be wrapped in double quotes.
 * @return {Object} Returns the git object for chaining.
 */
git.commit = (msg) => {
  shell.exec(`git commit -m ${msg}`)
  return git
}

/**
 * Push the commit to the remote repository.
 * @param {String} branchName The branch to push to.
 * @return {Object} Returns the git object for chaining.
 */
git.push = (branchName) => {
  shell.exec(`git push origin ${branchName}`)
  return git
}

/**
 * Tag the commit.
 * @param {String} tag The tag to apply to the commit. e.g. "v1.0.0"
 * @param {String} msg The tag message.
 * @return {Object} Returns the git object for chaining.
 */
git.tag = (tag, msg) => {
  shell.exec('git tag ' + tag + ' -m ' + msg)
  return git
}

/**
 * Export the git object by default for legacy support.
 * @deprecated This default export may be deprecated in a future major release, >=2. Use named exports instead.
 */
export default git
