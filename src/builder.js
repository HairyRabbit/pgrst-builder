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
  prerequest: () => true,
  postrequest: res => res
}

export class Build<T> {
  endpoint: string
  options: Options<T>
  url: URL
  normalize: boolean
  get: Function
  create: Function
  update: Function
  upsert: Function
  destory: Function
  create_many: Function
  update_many: Function
  upsert_many: Function
  destory_many: Function


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
    this.get = this.export(request.get)
    this.create = this.export(request.create)
    this.update = this.export(request.update)
    this.upsert = this.export(request.upsert)
    this.destory = this.export(request.destory)
    this.create_many = this.export(request.create_many)
    this.update_many = this.export(request.update_many)
    this.upsert_many = this.export(request.upsert_many)
    this.destory_many = this.export(request.destory_many)
  }

  /**
   * wrapped params constructor
   */
  params(qs: { [key: string]: string }) {
    const args = []

    for(let key in qs) {
      const item = qs[key]
      args.push([key, item])
    }

    return params.apply(null, args)(this)
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
   * wrapped request helper and apply response
   */
  export(req: Function) {
    return (data: Object): void | Promise<ResponseData<T>> => {
      const promise = req(data)(this)

      /**
       * cancel by prerequest
       */
      if(null === promise) {
        return
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
export default function build<T>(endpoint?: string = '',
                                 options?: Options<T> = {}): Build<T> {
  return new Build(endpoint, options)
}
