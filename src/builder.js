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

    /**
     * export request api
     */
    this.get = this._request(request.get)
    this.create = this._request(request.create)
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
  _request(req: Function) {
    return (...args): Promise<*> => {
      return req.apply(null, args)(this)
        .then(response.response(this.options.parser))
        .catch(response.request)
    }
  }
}

/**
 * hidden constructor and export helper
 */
export default function build(endpoint?: string = '',
                              options?: Options = {}): Builder {
  return new Build(endpoint, options)
}
