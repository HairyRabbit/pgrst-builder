/**
 * @jest
 */

import 'isomorphic-fetch'
import { log } from '@rabbitcc/logger'
import nock from 'nock'
import request from './request'
import { request as proc_req, response } from './response'
import build, { RequestError, ResponseError } from './'

test('should throw RequestError for client runtime error', () => {
  try {
    proc_req(new Error('foo'))
  } catch(error) {
    expect(
      error
    ).toBeInstanceOf(
      RequestError
    )

    expect(
      error.type
    ).toEqual(
      'client-internal'
    )
  }
})

test('should throw RequestError for somethime browser internal errors', () => {
  try {
    proc_req(new Error('Failed to fetch'))
  } catch(error) {
    expect(
      error
    ).toBeInstanceOf(
      RequestError
    )

    expect(
      error.type
    ).toEqual(
      'browser-internal'
    )
  }
})

const logger = a => log('[pgrst-builder.request.test]', a)

test('should throw ResponseError for 4XX', () => {
  nock('http://localhost')
    .log(logger)
    .get('/')
    .reply(400, {
      message: 'bad request'
    })

  return expect(
    request('get', {})()(build()).then(response()).catch(e => e.type)
  ).resolves.toEqual(
    'client-runtime'
  )
})

test('should throw ResponseError for 5XX', () => {
  nock('http://localhost')
    .log(logger)
    .get('/')
    .reply(500, {
      message: 'bad request'
    })

  return expect(
    request('get', {})()(build()).then(response()).catch(e => e.type)
  ).resolves.toEqual(
    'server-runtime'
  )
})
