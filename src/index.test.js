/**
 * @jest
 */

import 'isomorphic-fetch'
import { log } from '@rabbitcc/logger'
import nock from 'nock'
import build from './builder'
import http from './'

const logger = a => log('[pgrst-builder.request.test]', a)

test('should get data from server', () => {
  nock('http://localhost')
    .log(logger)
    .get('/')
    .reply(200, [{ id: 1, name: 'foo' }])

  return expect(
    http().get()
  ).resolves.toEqual(
    [{ id: 1, name: 'foo' }]
  )
})

test('should get data from server with params', () => {
  nock('http://localhost')
    .log(logger)
    .params({
      id: eq(1)
    })
    .get('/')
    .reply(200, [{ id: 1, name: 'foo' }])

  return expect(
    http().get()
  ).resolves.toEqual(
    [{ id: 1, name: 'foo' }]
  )
})
