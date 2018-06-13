/**
 * batch
 *
 * Batch the requests, override request url to `/batch`
 *
 * Example:
 *
 * ```js
 * batch(
 *   api.batch('user').post({ name: 'anon' }),
 *   api.batch('order').params({ id: eq(42) }).get()
 * )
 *
 * // will combine to
 *
 * api('batch').post([{
 *   url: 'user',
 *   headers: {},
 *   body: { name: 'anon' }
 * },{
 *   url: 'order?id=eq.42',
 *   headers: {},
 *   body: null
 * }])
 * ```
 * @flow
 */

import { fail } from '@rabbitcc/logger'
import build, { Build } from './builder'

export default function batch(...builders: Array<Build<*>>): Build<*> {
  if(builders.length < 2) {
    throw new Error(fail(
      '[pgrst-builder.batch]',
      'Batch mode require more then two builders'
    ))
  }

  const fst = builders[0]
  const batch_opt = fst.options.batch || {}
  return build(batch_opt.url).create_many(
    builders.map(builder => ({
      url: builder.url.toString(),
      method: builder.method,
      headers:  builder.headers,
      body: builder.body
    }))
  )
}
