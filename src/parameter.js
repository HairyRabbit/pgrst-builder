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

export default function params(...args: Array<[string, string]>) {
    return function(builder: Builder): Builder {
        return args.reduce((builder, params) => {
            builder.params.set.apply(builder.params, params)
            return builder
        }, builder)
    }
}

export function set(key: string | string => string,
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
        '[pgrst-builder.params.make]',
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
export const fts   = set('fts', null, prelang)
export const plfts = set('plfts', null, prelang)
export const phfts = set('phfts', null, prelang)
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
export const lang  = la => set(set_lang(la), String)
