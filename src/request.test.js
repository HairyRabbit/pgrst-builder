/**
 * @jest
 */

import 'isomorphic-fetch'
import { log } from '@rabbitcc/logger'
import nock from 'nock'
import build from './builder'
import params, { not, eq } from './parameter'
import request, {
  get,
  query,
  select,
  create,
  insert,
  update,
  upsert,
  destory,
  remove,
  create_many,
  insert_many,
  update_many,
  upsert_many,
  destory_many,
  remove_many
} from './request'

const logger = a => log('[pgrst-builder.request.test]', a)

test('should const request', () => {
  nock('http://localhost')
    .log(logger)
    .get('/')
    .reply(200)

  return expect(
    request('get', {})()(build())
      .then(res => [
        res.status,
        res.url
      ])
  ).resolves.toEqual(
    [
      200,
      'http://localhost/'
    ]
  )
})


/**
 * helpers
 */
test('should get', () => {
  nock('http://localhost')
    .log(logger)
    .get('/foo?bar=eq.42')
    .reply(200, {
      foo: 42
    })

  return expect(
    get()(params(['bar', eq(42)])(build('/foo')))
      .then(res => Promise.all([
        res.status,
        res.url,
        res.json()
      ]))
  ).resolves.toEqual(
    [
      200,
      'http://localhost/foo?bar=eq.42',
      {
        foo: 42
      }
    ]
  )
})

test('should query', () => {
  nock('http://localhost')
    .log(logger)
    .get('/foo?bar=not.eq.42')
    .reply(200, {
      foo: 42
    })

  return expect(
    query()(params(['bar', not(eq(42))])(build('/foo')))
      .then(res => Promise.all([
        res.status,
        res.url,
        res.json()
      ]))
  ).resolves.toEqual(
    [
      200,
      'http://localhost/foo?bar=not.eq.42',
      {
        foo: 42
      }
    ]
  )
})

test('should select', () => {
  nock('http://localhost')
    .log(logger)
    .get('/foo?bar=not.eq.42')
    .reply(200, {
      foo: 42
    })

  return expect(
    select()(params(['bar', not(eq(42))])(build('/foo')))
      .then(res => Promise.all([
        res.status,
        res.url,
        res.json()
      ]))
  ).resolves.toEqual(
    [
      200,
      'http://localhost/foo?bar=not.eq.42',
      {
        foo: 42
      }
    ]
  )
})

test('should create', () => {
  nock('http://localhost')
    .log(logger)
    .post('/foo')
    .reply(204, {})

  return expect(
    create(params())(build('/foo'))
      .then(res => Promise.all([
        res.status,
        res.url,
        res.json()
      ]))
  ).resolves.toEqual(
    [
      204,
      'http://localhost/foo',
      {}
    ]
  )
})

test('should insert', () => {
  nock('http://localhost')
    .log(logger)
    .post('/foo')
    .reply(204, {})

  return expect(
    insert(params())(build('/foo'))
      .then(res => Promise.all([
        res.status,
        res.url,
        res.json()
      ]))
  ).resolves.toEqual(
    [
      204,
      'http://localhost/foo',
      {}
    ]
  )
})

test('should update', () => {
  nock('http://localhost')
    .log(logger)
    .put('/foo')
    .reply(204, {})

  return expect(
    update(params())(build('/foo'))
      .then(res => Promise.all([
        res.status,
        res.url,
        res.json()
      ]))
  ).resolves.toEqual(
    [
      204,
      'http://localhost/foo',
      {}
    ]
  )
})

test('should upsert', () => {
  nock('http://localhost')
    .log(logger)
    .put('/foo')
    .reply(204, {})

  return expect(
    upsert(params())(build('/foo'))
      .then(res => Promise.all([
        res.status,
        res.url,
        res.json()
      ]))
  ).resolves.toEqual(
    [
      204,
      'http://localhost/foo',
      {}
    ]
  )
})

test('should destory', () => {
  nock('http://localhost')
    .log(logger)
    .delete('/foo')
    .reply(204, {})

  return expect(
    destory(params())(build('/foo'))
      .then(res => Promise.all([
        res.status,
        res.url,
        res.json()
      ]))
  ).resolves.toEqual(
    [
      204,
      'http://localhost/foo',
      {}
    ]
  )
})

test('should remove', () => {
  nock('http://localhost')
    .log(logger)
    .delete('/foo')
    .reply(204, {})

  return expect(
    remove(params())(build('/foo'))
      .then(res => Promise.all([
        res.status,
        res.url,
        res.json()
      ]))
  ).resolves.toEqual(
    [
      204,
      'http://localhost/foo',
      {}
    ]
  )
})


/**
 * helpers for batch operation
 */
test('should create many', () => {
  nock('http://localhost')
    .log(logger)
    .post('/foo')
    .reply(204, {})

  return expect(
    create_many(params())(build('/foo'))
      .then(res => Promise.all([
        res.status,
        res.url,
        res.json()
      ]))
  ).resolves.toEqual(
    [
      204,
      'http://localhost/foo',
      {}
    ]
  )
})

test('should insert many', () => {
  nock('http://localhost')
    .log(logger)
    .post('/foo')
    .reply(204, {})

  return expect(
    insert_many(params())(build('/foo'))
      .then(res => Promise.all([
        res.status,
        res.url,
        res.json()
      ]))
  ).resolves.toEqual(
    [
      204,
      'http://localhost/foo',
      {}
    ]
  )
})

test('should update many', () => {
  nock('http://localhost')
    .log(logger)
    .post('/foo')
    .reply(204, {})

  return expect(
    update_many(params())(build('/foo'))
      .then(res => Promise.all([
        res.status,
        res.url,
        res.json()
      ]))
  ).resolves.toEqual(
    [
      204,
      'http://localhost/foo',
      {}
    ]
  )
})

test('should upsert many', () => {
  nock('http://localhost')
    .log(logger)
    .post('/foo')
    .reply(204, {})

  return expect(
    upsert_many(params())(build('/foo'))
      .then(res => Promise.all([
        res.status,
        res.url,
        res.json()
      ]))
  ).resolves.toEqual(
    [
      204,
      'http://localhost/foo',
      {}
    ]
  )
})

test('should destory many', () => {
  nock('http://localhost')
    .log(logger)
    .delete('/foo')
    .reply(204, {})

  return expect(
    destory_many(params())(build('/foo'))
      .then(res => Promise.all([
        res.status,
        res.url,
        res.json()
      ]))
  ).resolves.toEqual(
    [
      204,
      'http://localhost/foo',
      {}
    ]
  )
})

test('should remove many', () => {
  nock('http://localhost')
    .log(logger)
    .delete('/foo')
    .reply(204, {})

  return expect(
    remove_many(params())(build('/foo'))
      .then(res => Promise.all([
        res.status,
        res.url,
        res.json()
      ]))
  ).resolves.toEqual(
    [
      204,
      'http://localhost/foo',
      {}
    ]
  )
})
