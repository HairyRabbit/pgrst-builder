/**
 * @jest
 */

import 'isomorphic-fetch'
import { log } from '@rabbitcc/logger'
import nock from 'nock'
import http from './builder'
import { eq, not, lte } from './parameter'

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
      data: {
        foo: 42
      }
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
