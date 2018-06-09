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
import params from './parameter'
import conn, { pad_qs as qs } from './connector'
import { default_options } from './'
import type { Options } from './'

export class Build {
  endpoint: string
  options: Options
  url: URL

  constructor(endpoint?: string = '', options?: Options = {}) {
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

    this.url = new URL(qs(
      conn({ protocol, host, port, username, password }),
      endpoint
    ))
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
   * wrapped request and apply response
   */
  _request(promise: Builder => Promise<Response>): Promise<*> {
    return promise(this)
      .then(response.proc_res(this.options.onResponseError))
      .then(response.proc_err(this.options.onResponseFailed))
      .catch(response.proc_req(this.options.onRequestError))
  }

  /**
   * export request api
   */
  get(...args: Array<*>) {
    return this._request(request.get.apply(null, ...args))
  }
}

/**
 * hidden constructor and export helper
 */
export default function build(endpoint?: string = '',
                              options?: Options = {}): Builder {
  return new Build(endpoint, options)
}