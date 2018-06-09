/**
 * PostgREST request builder
 *
 * Example:
 *
 * ```js
 * import Builder, { eq, not, lt } from 'pgrst-builder'
 *
 * new Builder()
 *  .params(                    // set search params
 *    ['id', not(eq(42))],
 *    ['age', lt(18)]
 *  )
 *  .get()                      // send request, via `fetch`
 *  .then(data => {             // handle reveived data
 *    // handle your data
 *  })
 * ```
 *
 * @flow
 */

/**
 * export options and default options
 */
export type Options = {
  protocol?: string,
  username?: ?string,
  password?: ?string,
  host?: string,
  port?: ?(string | number),
  headers?: Headers,
  onRequestError?: Function,
  onResponseError?: Function,
  onResponseFailed?: Function
}

export type Connect = {
  protocol: string,
  username: ?string,
  password: ?string,
  host: string,
  port: ?(string | number)
}

export type ApiResponse = {
  meta?: string,
  error: ?string,
  message: ?string,
  data: string
}

export const default_options: Options = {
  protocol: 'http',
  username: null,
  password: null,
  host: 'localhost',
  port: null,
  headers: {
    'Content-Type': 'application/json'
  },
  onRequestError: () => {},
  onResponseError: () => {},
  onResponseFailed: () => {}
}

/**
 * export api
 */
export { default as default } from './builder'
export {
  default as params,
  eq as eq,
  neq as neq,
  gt as gt,
  gte as gte,
  lt as lt,
  lte as lte,
  like as like,
  ilike as ilike,
  _in as _in,
  is as is,
  fts as fts,
  plfts as plfts,
  phfts as phfts,
  cs as cs,
  cd as cd,
  ov as ov,
  sl as sl,
  sr as sr,
  nxr as nxr,
  nxl as nxl,
  adj as adj,
  not as not
} from './parameter'
