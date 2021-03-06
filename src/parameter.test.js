/**
 * @jest
 */

import { unescape } from 'querystring'
import build from './builder'
import params, * as p from './parameter'

/**
 * bind to builder
 */
test('should make params', () => {
  const builder = build('qux')
  params({
    foo: 'eq.42',
    bar: 'not.gt.42'
  })(builder)

  expect(
    builder.url.searchParams.toString()
  ).toEqual(
    'foo=eq.42&bar=not.gt.42'
  )
})


/**
 * helpers
 */
test('should warp string with brackets', () => {
  expect(
    p.wrap_b('()')('foo')
  ).toEqual(
    '(foo)'
  )

  expect(
    p.wrap_b('[]')('bar')
  ).toEqual(
    '[bar]'
  )

  expect(
    p.wrap_b('{}')('baz')
  ).toEqual(
    '{baz}'
  )
})

test('should throw when brackets was invaild', () => {
  expect(
    () => p.wrap_b('""')('foo')
  ).toThrow()
})

test('should test value in enums', () => {
  expect(
    p.in_enum(['foo', 'bar'])('foo')
  ).toEqual(
    'foo'
  )
})

test('should throw when value not in enums', () => {
  expect(
    () => p.in_enum(['foo', 'bar'])('baz')
  ).toThrow()
})

test('should pass when string has a prefix', () => {
  expect(
    p.pre('foo.bar')
  ).toEqual(
    'foo.bar'
  )
})

test('should throw when not be a prefix', () => {
  expect(
    () => p.pre('foo')
  ).toThrow()
})

test('should prefix with lang', () => {
  expect(
    p.prelang('fts', ['%lang.foo%.bar'])
  ).toEqual(
    'fts(foo).bar'
  )
})

test('should prefix without lang', () => {
  expect(
    p.prelang('fts', ['bar'])
  ).toEqual(
    'fts.bar'
  )
})

test('should throw when prelang values not a array', () => {
  expect(
    () => p.prelang('fts', 'foo')
  ).toThrow()
})


/**
 * set value
 */
test('should set key to value', () => {
  expect(
    p.set('foo')('bar')
  ).toEqual(
    `foo.bar`
  )
})

test('should set key to value with proc', () => {
  expect(
    p.set('foo', _ => 'baz')('bar')
  ).toEqual(
    'foo.baz'
  )
})

test('should set key to values', () => {
  expect(
    p.set('foo')('bar', 'baz')
  ).toEqual(
    'foo.bar'
  )
})

test('should eq', () => {
  expect(
    p.eq('foo')
  ).toEqual(
    'eq.foo'
  )
})

test('should neq', () => {
  expect(
    p.neq('baz')
  ).toEqual(
    'neq.baz'
  )
})


test('should gt', () => {
  expect(
    p.gt('foo')
  ).toEqual(
    'gt.foo'
  )
})

test('should gte', () => {
  expect(
    p.gte(42)
  ).toEqual(
    'gte.42'
  )
})

test('should lt', () => {
  expect(
    p.lt(42)
  ).toEqual(
    'lt.42'
  )
})

test('should lte', () => {
  expect(
    p.lte(55)
  ).toEqual(
    'lte.55'
  )
})

test('should like', () => {
  expect(
    p.like('foo')
  ).toEqual(
    'like.foo'
  )

  expect(
    p.like('foo*bar*')
  ).toEqual(
    'like.foo*bar*'
  )
})

test('should ilike', () => {
  expect(
    p.ilike('foo')
  ).toEqual(
    'ilike.foo'
  )

  expect(
    p.ilike('foo*bar*')
  ).toEqual(
    'ilike.foo*bar*'
  )
})

test('should in', () => {
  expect(
    p._in('foo', 'bar')
  ).toEqual(
    'in.(foo,bar)'
  )
})

test('should is', () => {
  expect(
    p.is(true)
  ).toEqual(
    'is.true'
  )

  expect(
    p.is(false)
  ).toEqual(
    'is.false'
  )

  expect(
    p.is(null)
  ).toEqual(
    'is.null'
  )
})

test('should const lang', () => {
  expect(
    p.lang('foo')('bar')
  ).toEqual(
    '%lang.foo%.bar'
  )
})

test('should fts', () => {
  expect(
    p.fts('bar')
  ).toEqual(
    'fts.bar'
  )
})

test('should fts with lang', () => {
  expect(
    p.fts('%lang.foo%.bar')
  ).toEqual(
    'fts(foo).bar'
  )
})

test('should fts with lang helper', () => {
  expect(
    p.fts(p.lang('foo')('bar'))
  ).toEqual(
    'fts(foo).bar'
  )
})

test('should plfts', () => {
  expect(
    p.plfts('foo')
  ).toEqual(
    'plfts.foo'
  )
})

test('should phfts', () => {
  expect(
    p.phfts('foo')
  ).toEqual(
    'phfts.foo'
  )
})

test('should cs', () => {
  expect(
    p.cs(['foo', 'bar'])
  ).toEqual(
    `cs.{foo,bar}`
  )
})

test('should cd', () => {
  expect(
    p.cd([1,2,3])
  ).toEqual(
    `cd.{1,2,3}`
  )
})

test.skip('should ov', () => {
  expect(
    p.ov([new Date('2000-01-01'), new Date('2000-02-01')])
  ).toEqual(
    'ov.[2000-01-01, 2000-02-01]'
  )
})

test('should sl', () => {
  expect(
    p.sl([1, 2])
  ).toEqual(
    'sl.(1,2)'
  )
})

test('should sr', () => {
  expect(
    p.sr([1, 2])
  ).toEqual(
    'sr.(1,2)'
  )
})

test('should nxl', () => {
  expect(
    p.nxl([1, 2])
  ).toEqual(
    'nxl.(1,2)'
  )
})

test('should nxr', () => {
  expect(
    p.nxr([1, 2])
  ).toEqual(
    'nxr.(1,2)'
  )
})

test('should adj', () => {
  expect(
    p.adj([1, 2])
  ).toEqual(
    'adj.(1,2)'
  )
})


/**
 * select
 */
test('should set select filed', () => {
  expect(
    p.select('foo', 'bar')
  ).toEqual(
    'foo,bar'
  )
})

test('should set select filed with default value', () => {
  expect(
    p.select()
  ).toEqual(
    '*'
  )
})

test('should set select field with alias', () => {
  expect(
    p.select(p.alias('foo_bar', 'fooBar'))
  ).toEqual(
    'foo_bar:fooBar'
  )
})

test('should set select filed with type casting', () => {
  expect(
    p.select(p.cast('foo', 'text'))
  ).toEqual(
    'foo::text'
  )
})


/**
 * order
 */
test('should format order from string', () => {
  expect(
    p.fmt_order('foo')
  ).toEqual(
    'foo'
  )
})

test('should format order by column only', () => {
  expect(
    p.fmt_order({ col: 'foo' })
  ).toEqual(
    'foo'
  )
})

test('should format order by order', () => {
  expect(
    p.fmt_order({ col: 'foo', ord: 'desc' })
  ).toEqual(
    'foo.desc'
  )
})

test('should format order by null', () => {
  expect(
    p.fmt_order({ col: 'foo', nil: 'nullsfirst' })
  ).toEqual(
    'foo.nullsfirst'
  )
})

test('should format order by order and null', () => {
  expect(
    p.fmt_order({ col: 'foo', ord: 'desc', nil: 'nullsfirst' })
  ).toEqual(
    'foo.desc.nullsfirst'
  )
})

test('should order by string', () => {
  expect(
    p.order('foo', 'bar')
  ).toEqual(
    'foo,bar'
  )
})

test('should order by order', () => {
  expect(
    p.order('foo', { col: 'bar', ord: 'asc' })
  ).toEqual(
    'foo,bar.asc'
  )
})


/**
 * logic
 */
test('should and and or', () => {
  expect(
    p.and(
      p.col('foo', 'foo'),
      p.col('bar', 'bar')
    )
  ).toEqual(
    'and(foo.foo,bar.bar)'
  )

  expect(
    p.or(
      p.col('foo', 'foo'),
      p.col('bar', p.eq(42))
    )
  ).toEqual(
    'or(foo.foo,bar.eq.42)'
  )
})

test('should combine or and not', () => {
  expect(
    p.not(p.or(
      p.col('foo', 'foo'),
      p.col('bar', p.not(p.eq(42)))
    ))
  ).toEqual(
    'not.or(foo.foo,bar.not.eq.42)'
  )
})

test('should col helper', () => {
  expect(
    p.col('foo', 'bar')
  ).toEqual(
    'foo.bar'
  )
})


test('should prefix with logic operation', () => {
  const builder = build('qux')
  params(p.and(
    p.col('id', p.eq(42)),
    p.or(
      p.col('name', p.eq('foo')),
      p.col('age', p.gt(42))
    )
  ))(builder)

  expect(
    unescape(builder.url.searchParams.toString())
  ).toEqual(
    `and=(id.eq.42,or(name.eq.foo,age.gt.42))`
  )
})
