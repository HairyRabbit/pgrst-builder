/**
 * response
 *
 * Handle response and errors
 *
 * Includes three parts of errors:
 *
 * 1. request connect error, happen when network error or
 *    client code bug. should fix this on development mode.
 * 2. received code not be 20X(50X or 40X).
 * 3. received successful, but error filed not be `null`
 *
 * [PostgREST HTTP status codes](https://postgrest.org/en/stable/api.html#http-status-codes)
 *
 * +---------------+-------------------------------+
 * | code          | description                   |
 * +---------------+-------------------------------+
 * | 503           | pg connection err             |
 * | 503           | insufficient resources        |
 * | 500           | triggered action exception    |
 * | 500           | invalid transaction state     |
 * | 500           | obj not in prerequisite state |
 * | 500           | operator intervention         |
 * | 500           | system error                  |
 * | 500           | conf file error               |
 * | 500           | foreign data wrapper error    |
 * | 500           | external routine exception    |
 * | 500           | external routine invocation   |
 * | 500           | savepoint exception           |
 * | 500           | transaction rollback          |
 * | 500           | PL/pgSQL error                |
 * | 500           | internal error                |
 * | 413           | too complex                   |
 * | 409           | foreign key violation         |
 * | 409           | uniqueness violation          |
 * | 403           | invalid grantor               |
 * | 403           | invalid role specification    |
 * | 403 or 401[1] | insufficient privileges       |
 * | 404           | undefined function            |
 * | 404           | undefined table               |
 * | 400           | default code for “raise”      |
 * +---------------+-------------------------------+
 *
 * Notes:
 * 1. if authenticated then return 403, else return 401
 *
 * @flow
 */

import { log, fail } from '@rabbitcc/logger'
import { RequestError, ResponseError } from './'
import type { Parser, ResponseData } from './'

/**
 * Handle fetch request errors, something happen like:
 *
 *   - network can't connect
 *   - CSP by `connect-src 'self'`
 *   - code bugs when call `fetch()`
 *
 * Example:
 *
 * ```js
 * // Throw when call fetch error
 * fetch().catch(console.log)
 * fetch('', 42).catch(console.log)
 * //=> TypeError: Failed to execute 'fetch' on 'Window'
 *
 * // Throw when browsers CSP prevent
 * fetch('a://b').catch()
 * //=> TypeError: Failed to fetch
 *
 * // Throw when network conenct failed
 * fetch(42).catch(console.log)
 * //=> TypeError: Failed to fetch
 * ```
 */
export function request(err: Error): void {
  /**
   * pass ResponseError
   */
  if(!err instanceof Error) {
    throw err
  }

  /**
   * handle CSP or network connect error
   */
  if(/Failed to fetch/.test(err.message)) {
    throw new RequestError({
      type: 'browser-internal',
      error: err
    })
  }

  throw new RequestError({
    type: 'client-internal',
    error: err
  })
}

/**
 * Handle response errors, the status code not 2XX. If passed,
 * apply parser for response body by content type, default to
 * `res.json()`. Sometimes pgrst will not return anything, like
 * `create` operation, just return 201 status code. pass parse
 * to `false` will just return by `Promise.resolve()`:
 *
 * Example:
 *
 * ```js
 * api().create().then(() => {
 *   // already create successful
 * })
 * ```
 *
 * If want get created data, should pass `{ Prefer: return=representation}`
 * header to request, this was a default behavior.
 *
 * Example:
 *
 * ```js
 * api.create().then(data => {
 *   // record was created success by pg
 * })
 * ```
 */
export function response<T>(parse?: Parser<T>, normalize?: boolean) {
  return function response1(res: Response): ResponseData<T> {
    const { ok, status, headers } = res

    if(!ok) {
      let type = ''
      if(status >= 400 && status < 500) {
        /**
         * handle 4XX errors. Most of them are user behavior,
         * also the client code bug.
         */
        type = 'client-runtime'

      } else if(status >= 500) {
        /**
         * handle 5XX errors. often the server bug, should report
         * to logger server.
         */
        type = 'server-runtime'

      } else {
        /**
         * this should never throw
         */
        throw new Error(fail(
          '[pgrst-builder.internal]',
          'Response not ok, but status not in range 400 - 500',
          `status: ${status}`
        ))
      }

      /**
       * By default if something wrong, PostgREST will send json that
       * with a message field for error details, otherwise will send datas:
       *
       * ```json
       * {
       *   message: 'Error in $: Failed reading: not a valid json value'
       * }
       * ```
       */
      return res.json().then(({ message }) => {
        throw new ResponseError({ type, message })
      })
    }

    /**
     * received successful, then parse response data
     */
    let promise

    if(parse || false === parse) {
      if('function' === typeof parse) {
        promise = parse(res)
      } else if('boolean' === typeof parse) {
        promise = parse ? res.json() : Promise.resolve()
      } else {
        throw new Error(fail(
          '[pgrst-builder.response]',
          `parse should be booelan or a function, but got ${typeof parse}`
        ))
      }
    } else {
      promise = res.json()
    }

    /**
     * normalize response data for single record operation
     */
    if(normalize) {
      return promise.then(datas => {
        if(Array.isArray(datas)) {
          return datas[0]
        }
      })
    }

    return promise
  }
}
