/**
 * @jest
 */

import 'isomorphic-fetch'
import { escape } from 'querystring'
import { log } from '@rabbitcc/logger'
import nock from 'nock'
import http from './builder'
import {
  eq,
  not,
  lte,
  alias,
  cast,
  asc,
  desc
} from './parameter'

test('should const builder', () => {
  expect(
    http('foo').url.toString()
  ).toEqual(
    'http://localhost/foo'
  )
})

test('should build with params', () => {
  expect(
    http('foo')
      .params({
        id: eq(42)
      })
      .url.toString()
  ).toEqual(
    'http://localhost/foo?id=eq.42'
  )
})

const logger = a => log('[pgrst-builder.request.test]', a)

test('should build with params and request', () => {
  nock('http://localhost')
    .log(logger)
    .get('/foo?id=eq.42&age=not.lte.17')
    .reply(200, {
      foo: 42
    })

  return expect(
    http('foo')
      .params({
        id: eq(42),
        age: not(lte(17))
      })
      .get()
  ).resolves.toEqual(
    {
      foo: 42
    }
  )
})


/**
 * select
 */
test('should apply select filed', () => {
  expect(
    http('foo')
      .select('id', alias('full_name', 'fullName'), cast('name', 'text'))
      .url.toString()
  ).toEqual(
    `http://localhost/foo?select=${escape('id,full_name:fullName,name::text')}`
  )
})


/**
 * order
 */
test('should apply order field', () => {
  expect(
    http('foo')
      .order(desc('foo'), asc('bar'))
      .url.toString()
  ).toEqual(
    `http://localhost/foo?order=${escape('foo.desc,bar.asc')}`
  )
})


/**
 * offset
 */
test('should add offset', () => {
  expect(
    http('foo')
      .offset(10)
      .url.toString()
  ).toEqual(
    `http://localhost/foo?offset=10`
  )
})

test('should add offset with limit', () => {
  expect(
    http('foo')
      .offset(10, 50)
      .url.toString()
  ).toEqual(
    `http://localhost/foo?limit=50&offset=10`
  )
})

test('should add offset with limit from options', () => {
  expect(
    http('foo', { limit: 42 })
      .offset(10)
      .url.toString()
  ).toEqual(
    `http://localhost/foo?limit=42&offset=10`
  )
})

test('should add offset with limit override options.limit', () => {
  expect(
    http('foo', { limit: 42 })
      .offset(10, 50)
      .url.toString()
  ).toEqual(
    `http://localhost/foo?limit=50&offset=10`
  )
})
