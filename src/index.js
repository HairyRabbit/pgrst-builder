/**
 * request builder
 *
 * Request builder, PostgREST friendly, also used for normal
 * request. Build top on `fetch` API, so your browser or node
 * should supports fetch and promise.
 *
 * Example:
 *
 * ```js
 * import api, { eq, not, lt, desc } from 'pgrst-builder'
 *
 * api('/user')
 *  .params({                   // set search params
 *    id: not(eq(42))
 *    age: lt(18)
 *  })
 *  .select('name')             // set select fields
 *  .order(desc('age'))         // set order fields
 *  .get()                      // send request, via `fetch`
 *  .then(data => {             // handle reveived data
 *     // handle your data
 *  })
 *  .catch(err => {             // handle errors
 *     // handle errors
 *  })
 * ```
 *
 * Interface:
 *
 * ```js
 * interface Builder {
 *   endpoint: string,          // request endpoint
 *   options: Options           // options, see below
 *   params({                   // add query params
 *     [key: string]: string
 *   }): Builder
 *   [requests](): Promise<Response>
 * }
 *
 * type Options = {
 *   // connect options
 *   protocol: string,
 *
 * }
 * ```
 *
 * @flow
 */

export type ResponseData<T> =
  | T
// $FlowFixMe
  | $ElementType<T, 0>
  | typeof undefined

export type Parser<T> =
  | (Response => Promise<ResponseData<T>>)
  | boolean

/**
 * export options and default options
 */
export type Options<T> = {
  protocol?: string,
  username?: ?string,
  password?: ?string,
  host?: string,
  port?: ?(string | number),
  headers?: { [key: string]: string },
  parser?: Parser<T>,
  fetch?: Object
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

export const default_options: Options<*> = {
  protocol: 'http',
  host: 'localhost',
  headers: {
    'Content-Type': 'application/json'
  },
  fetch: {}
}

/**
 * custom errors
 *
 * RequestError - for fetch error
 * ResponseError - for received failed
 */

type RequestErrorOptions = {
  type: string,
  error: Error
}

export class RequestError extends Error {
  message: string
  type: string

  constructor(options: RequestErrorOptions, ...args: Array<*>) {
    super(...args)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequestError)
    }

    const { type, error } = options
    this.type = type

    switch(type) {
      case 'browser-internal':
        this.message = 'Something wrong with before request server' +
          error.message
        break
      case 'client-internal':
        this.message = `Can't call fetch, looks like a code bug, `  +
          `please report it at ` +
          'https://github.com/HairyRabbit/pgrst-builder/issues \n' +
          error.message
        break
    }
  }
}

type ResponseErrorOptions = {
  type: string,
  message: string
}

export class ResponseError extends Error {
  message: string
  type: string

  constructor(options: ResponseErrorOptions, ...args: Array<*>) {
    super(...args)

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResponseError)
    }

    const { type, message } = options

    this.type = type
    this.message = message
  }
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
  not as not,
  lang as lang,
  asc as asc,
  desc as desc,
  nullfst as nullfst,
  nulllst as nulllst
} from './parameter'
