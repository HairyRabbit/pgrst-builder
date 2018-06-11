/**
 * URL search params constructor
 *
 * @example
 *
 * ```js
 * var builder = new Builder()
 * params(['foo', 'eq.42'], ['bar', 'not.gt.3'])(builder)
 *
 * //=> builder.params => 'foo=eq.42&bar=not.gt.3'
 * ```
 *
 * @flow
 */

import { fail } from '@rabbitcc/logger'
import { Build } from './builder'

export default function params(...args: Array<[string, string]>) {
  return function(builder: *): * {
    return args.reduce((builder, params) => {
      const qs = builder.url.searchParams
      qs.set.apply(qs, params)
      return builder
    }, builder)
  }
}

export function set(key: string,
                    proc?: any => string = a => a,
                    mod?: (string, Array<any>) => string) {
  return function set1(...value: Array<any>): string {
    if(mod) {
      return mod(key, value)
    }

    let k = key
    let v = proc.apply(null, value)

    return `${k}.${v}`
  }
}


export function to_s(a: any): string {
  return String(a)
}

export function wrap_b(brackets: string) {
  if('production' !== process.env.NODE_ENV) {
    if(!Boolean(~['()', '[]', '{}'].indexOf(brackets))) {
      throw new Error(fail(
        '[pgrst-builder.params]',
        `Unknow brackets: ${brackets}`
      ))
    }
  }

  const [ left, right ] = brackets

  return function wrap_b1(...items: Array<any>): string {
    return left + items.map(String).join(',') + right
  }
}

export function in_enum(e: Array<string>) {
  return function in_enum1(value: any): string {
    const str = String(value)

    if('production' !== process.env.NODE_ENV) {
      if(!Boolean(~e.indexOf(str))) {
        throw new Error(fail(
          '[pgrst-builder.params.make]',
          `Value not valid: ${value}, should be oneof ${e.join(', ')}`
        ))
      }
    }

    return str
  }
}

export function pre(value: any): string {
  const str = String(value)

  if('production' !== process.env.NODE_ENV) {
    if(!/[^.]+\.[^]+/.test(str)) {
      throw new Error(fail(
        '[pgrst-builder.params.make]',
        `Operator "not" should used for chain another operator` +
          `, like "not.eq.3"`
      ))
    }
  }

  return str
}

export function prelang(key: string, value: Array<any>): string {
  if('production' !== process.env.NODE_ENV) {
    if(!Array.isArray(value)) {
      throw new Error(fail(
        '[pgrst-builder.params.make]',
        `prelang values should be a array`
      ))
    }
  }
  const str = String(value.length ? value[0] : '')
  const re = /^%lang\.([^%]+)%\.([^]+)$/
  const ma = str.match(re)

  return ma
    ? `${key}(${ma[1]}).${ma[2]}`
    : `${key}.${str}`
}

export function set_lang(value: string): string {
  return `%lang.${value}%`
}

/**
 * export filter
 */
export const not   = set('not', pre)
export const eq    = set('eq', String)
export const neq   = set('neq', String)
export const gt    = set('gt', String)
export const gte   = set('gte', String)
export const lt    = set('lt', String)
export const lte   = set('lte', String)
export const like  = set('like', String)
export const ilike = set('ilike', String)
export const _in   = set('in', wrap_b('()'))
export const is    = set('is', in_enum(['null', 'true', 'false']))
export const fts   = set('fts', undefined, prelang)
export const plfts = set('plfts', undefined, prelang)
export const phfts = set('phfts', undefined, prelang)
export const cs    = set('cs', wrap_b('{}'))
export const cd    = set('cd', wrap_b('{}'))
export const ov    = set('ov', wrap_b('[]'))
export const sl    = set('sl', wrap_b('()'))
export const sr    = set('sr', wrap_b('()'))
export const nxr   = set('nxr', wrap_b('()'))
export const nxl   = set('nxl', wrap_b('()'))
export const adj   = set('adj', wrap_b('()'))

/**
 * special filter
 */
export const lang  = (la: string) => set(set_lang(la), String)

/**
 * vertical filtering columns, for `select` param. e.g.
 *
 * Example:
 *
 * ```url
 * GET /user?select=name,age
 * ```
 *
 * So can call `select()` to add filter. can use `alias()`
 * to defined response field name, and use `case()` to cast
 * type.
 *
 * Example:
 *
 * ```js
 * select('foo', alias('bar', 'baz'), case('qux', 'text'))
 * //=> foo,bar:baz,qux::text
 * ```
 *
 * By default, use `*` for all columns
 */

export function select(...items: Array<string>): string {
  return !items.length ? '*' : items.join(',')
}

/**
 * `select` field for alias
 */
export function alias(from: string, to: string): string {
  return `${from}:${to}`
}

/**
 * `select` filed for type convertion
 */
export function cast(col: string, type: string): string {
  return `${col}::${type}`
}

/**
 * vertical filtering columns, for `order` param. e.g.
 *
 * Example:
 *
 * ```url
 * GET /user?order=age.desc
 * ```
 *
 * By default use `asc` ordered
 */
type Order = {
  col: string,
  ord?: 'acs' | 'desc',
  nil?: 'nullsfirst' | 'nullslast'
}

export function order(...items: Array<string | Order>): string {
  return items.map(fmt_order).join(',')
}

/**
 * helper function to construct flag helper
 */
export function order_by(key: string, flag: string) {
  return function order_by1(col: string): Order {
    return {
      col,
      [key]: flag
    }
  }
}

/**
 * helper function to construct order value string
 *
 * Example:
 *
 * ```js
 * fmt_order('foo')
 * //=> foo
 *
 * fmt_order({ col: 'bar', ord: 'asc' })
 * //=> 'bar.asc'
 *
 * fmt_order({ col: 'bar', nil: 'nullslast' })
 * //=> 'bar.nullslast'
 *
 * fmt_order({ col: 'bar', ord: 'desc', nil: 'nullslast' })
 * //=> 'bar.nullslast'
 * ```
 */
export function fmt_order(item: string | Order): string {
  if('string' === typeof item) {
    return item
  }

  const { col, ord, nil } = item
  return [col, ord, nil].filter(Boolean).join('.')
}

export const asc     = order_by('ord', 'asc')
export const desc    = order_by('ord', 'desc')
export const nullfst = order_by('nil', 'nullsfirst')
export const nulllst = order_by('nil', 'nullslast')
