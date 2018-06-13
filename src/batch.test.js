/**
 * @jest
 */

import 'isomorphic-fetch'
import { log } from '@rabbitcc/logger'
import nock from 'nock'
import batch from './batch'
import api from './builder'

const logger = a => log('[pgrst-builder.request.test]', a)

test('should batch request', () => {
  nock('http://localhost')
    .log(logger)
    .post('/batch')
    .reply(200, [{ id: 1, name: 'foo' }])

  return expect(
    batch(
      api.batch('foo').get(),
      api.batch('bar').get()
    )
  ).resolves.toEqual(
    [{ id: 1, name: 'foo' }]
  )
})
