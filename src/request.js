/**
 * Request constructor, apply to `fetch` api
 *
 * @flow
 */

import { log, fail } from '@rabbitcc/logger'
import { Parser } from 'json2csv'
import Builder from './builder'
import type { Options, OperationHeader } from './'

/**
 * wrapped for many helpers with method and default headers
 *
 * includes:
 *
 *   - get
 *   - create
 *   - update
 *   - upsert
 *   - destory
 *   - create_many
 *   - update_many
 *   - upsert_many
 *   - destory_many
 */
export default function request(method: string, headers?: Headers = {}) {
  /**
   * construct request with params, also can override options at this level
   *
   * @example
   *
   * ```js
   * import { params, eq } from 'pgrst-builder'
   *
   * request(params(['id', eq(3)])) //=> Builder => Promise<Response>
   * ```
   */
  return function request1(data?: object, options?: Options = {}) {
    /**
     * construct with builder
     *
     * @example
     *
     * ```js
     * import Builder from 'pgrst-builder'
     *
     * request()(new builder()) //=> Promise<Response>
     * ```
     */
    return function request2(builder: Builder): Promise<Response> {
      /**
       * combine options
       */
      const fetch_opt = {
        /**
         * issue for `Set-Cookie` headers
         */
        method,
        credentials: 'same-origin',
        ...builder.options.fetch,
        ...options,
        headers: {
          ...headers,
          ...builder.options.fetch.headers,
          ...builder.options.headers,
          ...options.headers
        }
      }

      /**
       * handle body
       *
       * looks like pgrst can't hold on json without stringify, see
       * https://postgrest.org/en/stable/api.html#insertions-updates
       *
       * bulk operation also supports CSV format, so should use
       * csv for fast parse on server. want to use this feature,
       * need enabled `PGRST_BUILD_CSV` env.
       */
      if(data) {
        if(process.env.PGRST_BUILD_CSV &&
           'text/csv' === fetch_opt.headers['Content-Type']) {
          const { parse } = new Parser()

          try {
            fetch_opt.body = parse(data)
          } catch(err) {
            throw new Error(err)
          }
        } else {
          fetch_opt.body = JSON.stringify(data)
        }
      }

      /**
       * apply to fetch
       */
      return fetch(builder.url.toString(), fetch_opt)
    }
  }
}

const oper = { 'Prefer': 'return=representation'}

/**
 * export helpers and alias
 */
export const get          = request('get')
export const create       = request('post', oper)
export const update       = request('put', oper)
export const upsert       = request('put', oper)
export const destory      = request('delete', oper)
export const create_many  = request('post', oper)
export const update_many  = request('post', oper)
export const upsert_many  = request('post', oper)
export const destory_many = request('delete', oper)

export const query        = get
export const select       = get
export const insert       = create
export const remove       = destory
export const insert_many  = create_many
export const remove_many  = destory_many
