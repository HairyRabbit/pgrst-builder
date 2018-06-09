/**
 * Make connect url string
 *
 * Example:
 *
 * ```js
 * connect({ port: 8080 }) //=> 'http://localhost:8080'
 * ```
 *
 * @flow
 */

import { fail } from '@rabbitcc/logger'
import type { Connect } from './'

export default function connect(options: Connect): string {
  const {
    protocol,
    username,
    password,
    host,
    port
  } = options

  if('production' !== process.env.NODE_ENV) {
    if(!protocol) {
      throw new Error(fail(
        '[pgrst-builder.connect.create]',
        'The connect protocol was requied'
      ))
    }

    if(!host) {
      throw new Error(fail(
        '[pgrst-builder.connect.create]',
        'The connect host was requied'
      ))
    }
  }

  const auth = username
        ? (password
            ? [username, password].join(':')
            : username)
        : null

  const hosts = port
        ? [host, port].join(':')
        : host

  return [
    protocol,
    auth ? [auth, hosts].join('@') : hosts
  ].join('://')
}

/**
 * Append endpoint to connect string
 */
export function pad_qs(conn: string, qs: string): string {
  /**
   * prepand slash when qs not start with `/`
   */
  const pad_qs = qs.startsWith('/')
        ? qs
        : ('/' + qs)

  return conn + pad_qs
}
