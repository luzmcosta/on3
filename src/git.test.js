/**
 * @file Test the Git module
 * @module test:git
 *
 * @notes
 * Mock shell commands to prevent them from actually running.
 * Mock shell.echo to prevent the error message from printing to the console.
 * Mock shell.exec to assert whether this is a Git repository.
 * Mock shell.which to assert whether Git is available.
 */

import shell from 'shelljs'
import { git } from './git.js'

describe('git', () => {
  afterEach(() => {
    // Restore all mocks back to their original implementations.
    jest.restoreAllMocks()
  })

  test('has a consistent public API accessible to users', () => {
    const actualKeys = Object.keys(git)
    const expectedKeys = ['isAvailable', 'isPackage', 'add', 'commit', 'push', 'tag']

    // Assert the API contract.
    expect(actualKeys).toEqual(expectedKeys)

    expect(typeof git.isAvailable).toBe('function')
    expect(typeof git.isPackage).toBe('function')
    expect(typeof git.add).toBe('function')
    expect(typeof git.commit).toBe('function')
    expect(typeof git.push).toBe('function')
    expect(typeof git.tag).toBe('function')
  })

  test('can inform the user when Git is available', () => {
    shell.which = jest.fn(() => true)

    const result = git.isAvailable()

    expect(result).toBe(true)

    expect(shell.which).toHaveBeenCalledTimes(1)
    expect(shell.which).toHaveBeenCalledWith('git')
  })

  test('can inform the user when Git is NOT available', () => {
    shell.which = jest.fn(() => false)

    const result = git.isAvailable()

    expect(result).toBe(false)

    expect(shell.which).toHaveBeenCalledTimes(1)
    expect(shell.which).toHaveBeenCalledWith('git')
  })

  test('can default to the current directory when checking if the package is a Git repository', () => {
    shell.exec = jest.fn(() => ({ code: 0 }))

    const result = git.isPackage()

    expect(result).toBe(true)
  })

  test('can inform the user when the package is a Git repository', () => {
    shell.exec = jest.fn(() => ({ code: 0 }))

    const path = '~'
    const result = git.isPackage(path)

    expect(result).toBe(true)
  })

  test('can inform the user when the package is NOT a Git repository', () => {
    shell.exec = jest.fn(() => ({ code: 1 }))

    const path = '~'
    const result = git.isPackage(path)

    expect(result).toBe(false)
  })

  test('can add a file to the Git staging area', () => {
    shell.exec = jest.fn((value) => value)

    const output = git.add('test.txt')

    expect(shell.exec).toHaveBeenCalledWith('git add test.txt')
    expect(output).toEqual(git)
  })

  test('can commit the staged files', () => {
    shell.exec = jest.fn((value) => value)

    const output = git.commit('"test commit"')

    expect(shell.exec).toHaveBeenCalledWith('git commit -m "test commit"')
    expect(output).toEqual(git)
  })

  test('can push the commit to the remote repository', () => {
    shell.exec = jest.fn((value) => value)

    const output = git.push('test-branch-name')

    expect(shell.exec).toHaveBeenCalledWith('git push origin test-branch-name')
    expect(output).toEqual(git)
  })

  test('can tag the commit', () => {
    shell.exec = jest.fn((value) => value)

    const output = git.tag('v1.2.3', 'test tag')

    expect(shell.exec).toHaveBeenCalledWith('git tag v1.2.3 -m test tag')
    expect(output).toEqual(git)
  })
})
