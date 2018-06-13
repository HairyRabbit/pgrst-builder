/**
 * PostgREST request builder
 *
 * Example:
 *
 * ```js
 * const builder = new Builder(endpoint, options)
 * ```
 *
 * @flow
 */

import { fail, warn } from '@rabbitcc/logger'
import * as request from './request'
import * as response from './response'
import params, { select, order } from './parameter'
import conn, { pad_qs as qs } from './connector'
import type { Options, ResponseData } from './'

const default_options: Options<*> = {
  protocol: 'http',
  host: 'localhost',
  headers: {
    'Content-Type': 'application/json'
  },
  fetch: {},
  batch: {
    url: 'batch'
  },
  prerequest: () => true,
  postrequest: res => res
}

export class Build<T> {
  endpoint: string
  options: Options<T>
  url: URL
  normalize: boolean
  batch: boolean
  get: Function
  create: Function
  update: Function
  upsert: Function
  destory: Function
  create_many: Function
  update_many: Function
  upsert_many: Function
  destory_many: Function
  body: Object
  headers: Object
  method: string

  constructor(endpoint?: string = '', options?: Options<T> = {}) {
    /**
     * throw when not provide endpoint at development mode
     */
    if('production' !== process.env.NODE_ENV) {
      if('' === endpoint) {
        warn(
          '[pgrst-builder.builder.create]',
          'Endpoint was not set'
        )
      }
    }

    this.endpoint = endpoint

    /**
     * combine options with default options
     */
    this.options = {
      ...default_options,
      ...options
    }

    /**
     * initial connect url and query params
     */
    const { protocol, host, port, username, password } = this.options

    if(!protocol || !host) {
      throw new Error(fail(
        '[pgrst-builder.internal]',
        'The protocol or host was required'
      ))
    }

    this.url = new URL(qs(
      conn({ protocol, host, port, username, password }),
      endpoint
    ))

    /**
     * export request api
     */
    this.get          = this.export(request.get)
    this.create       = this.export(request.create)
    this.update       = this.export(request.update)
    this.upsert       = this.export(request.upsert)
    this.destory      = this.export(request.destory)
    this.create_many  = this.export(request.create_many)
    this.update_many  = this.export(request.update_many)
    this.upsert_many  = this.export(request.upsert_many)
    this.destory_many = this.export(request.destory_many)
  }

  /**
   * wrapped params constructor
   */
  params(args: string | { [key: string]: string }) {
    return params(args)(this)
  }

  /**
   * select filed
   */
  select(...args: Array<string>) {
    this.url.searchParams.set('select', select.apply(null, args))
    return this
  }

  /**
   * order filed
   */
  order(...args: Array<string>) {
    this.url.searchParams.set('order', order.apply(null, args))
    return this
  }

  /**
   * offset for limits and pagination
   *
   * Example:
   *
   * ```js
   * // basic use
   * http().offset(10)
   *
   * // set limit by paramter
   * http().offset(10, 50)
   *
   * // set limit by options
   * http('ep', { limit: 50 }).offset(10)
   * ```
   *
   * The `limit` paramter will overrided the `options.limit`
   */
  offset(num: number, limit?: number) {
    const li = limit || this.options.limit
    if(li) {
      this.url.searchParams.set('limit', String(li))
    }

    this.url.searchParams.set('offset', String(num))

    return this
  }

  /**
   * wrapped request helper and apply response
   */
  export(req: Function) {
    return (data: Object): * => {
      const promise = req(data)(this)

      /**
       * cancel by prerequest
       */
      if(null === promise) {
        return this
      }

      return promise
        .then(response.response(this.options.parser, this.normalize))
        .catch(response.request)
    }
  }
}

/**
 * hidden constructor and export helper
 */
export default function build<T>(...args: *): Build<T> {
  return new Build(...args)
}

build.batch = function batched_build<T>(...args: *): Build<T> {
  const build = new Build(...args)
  build.batch = true
  return build
}
