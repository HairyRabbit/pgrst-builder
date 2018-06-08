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
 * PostgREST HTTP status codes
 * @link {https://postgrest.org/en/stable/api.html#http-status-codes}
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

export default function response(res: Response) {

}

/**
 * Handle runtime errors or connect failed:
 *
 * @exmaple
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
export function hd_req({ onRequestError }) {
  return function hd_req1(err: Error) {
    /**
     * handle CSP or network connect error
     */
    if(/Failed to fetch/.test(err.message)) {
      onRequestError({ type: 'browser' })
    }
  }
}

export function hd_code(code: number): any {

}

export function hd_create_failed() {

}
