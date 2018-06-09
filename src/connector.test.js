/**
 * @jest
 */

import connect, { pad_qs } from './connector'

test('should default connect url', () => {
  expect(
    connect({
      protocol: 'foo',
      host: 'bar'
    })
  ).toEqual(
    'foo://bar'
  )
})

test('should append user', () => {
  expect(
    connect({
      protocol: 'foo',
      host: 'bar',
      username: 'baz'
    })
  ).toEqual(
    'foo://baz@bar'
  )
})

test('should append user with password', () => {
  expect(
    connect({
      protocol: 'foo',
      host: 'bar',
      username: 'baz',
      password: 'qux'
    })
  ).toEqual(
    'foo://baz:qux@bar'
  )
})

test('should with port', () => {
  expect(
    connect({
      protocol: 'foo',
      host: 'bar',
      port: 42
    })
  ).toEqual(
    'foo://bar:42'
  )

  expect(
    connect({
      protocol: 'foo',
      host: 'bar',
      port: '8080'
    })
  ).toEqual(
    'foo://bar:8080'
  )
})


/**
 * real world
 */
test('should test real world', () => {
  expect(
    connect({
      protocol: 'https',
      host: 'github.com',
      port: '443',
      username: 'git'
    })
  ).toEqual(
    'https://git@github.com:443'
  )
})


/**
 * throw at development mode
 */
test('should throw when not provide protocol', () => {
  expect(
    () => connect({
      host: 'localhost'
    })
  ).toThrow()
})

test('should throw when not provide host', () => {
  expect(
    () => connect({
      protocol: 'foo'
    })
  ).toThrow()
})


test('should append query string', () => {
  expect(
    pad_qs('foo', 'bar')
  ).toEqual(
    'foo/bar'
  )
})

test('should append query string and ignore slash ', () => {
  expect(
    pad_qs('foo', '/bar')
  ).toEqual(
    'foo/bar'
  )
})
