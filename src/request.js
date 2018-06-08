/**
 * Request constructor
 *
 * @flow
 */

import { log, fail } from '@rabbitcc/logger'
import Builder from './builder'
import type { Options } from './'

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
export default function request(method: string, headers: Headers = {}) {
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
  return function request1(params?: Builder => Builder,
                           options?: Options = {},
                           body?: string) {
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
       * set params to `builder.params` if provide
       */
      if(params) {
        builder = params(builder)
      }

      /**
       * apply to fetch
       */
      return fetch(builder.url.toString(), {
        /**
         * issue for `Set-Cookie` headers
         */
        method,
        body,
        credentials: 'same-origin',
        headers: {
          ...headers,
          ...builder.options.headers,
          ...options.headers
        },
        ...builder.options,
        ...options
      })
    }
  }
}

/**
 * export helpers and alias
 */
export const get          = request('get')
export const query        = request('get')
export const select       = request('get')
export const create       = request('post', { 'Prefer': 'return=representation' })
export const insert       = request('post', { 'Prefer': 'return=representation' })
export const update       = request('put', { 'Prefer': 'return=representation' })
export const upsert       = request('put', { 'Prefer': 'return=representation' })
export const destory      = request('delete', { 'Prefer': 'return=representation' })
export const remove       = request('delete', { 'Prefer': 'return=representation' })
export const create_many  = request('post', { 'Prefer': 'return=representation' })
export const insert_many  = request('post', { 'Prefer': 'return=representation' })
export const update_many  = request('post', { 'Prefer': 'return=representation' })
export const upsert_many  = request('post', { 'Prefer': 'return=representation' })
export const destory_many = request('delete', { 'Prefer': 'return=representation' })
export const remove_many  = request('delete', { 'Prefer': 'return=representation' })
