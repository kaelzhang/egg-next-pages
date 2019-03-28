const test = require('ava')

test('set headers', async t => {
  const {get} = await require('./fixtures/create')('set_header')

  const {
    text,
    statusCode,
    headers
  } = await get('/foo')

  t.is(statusCode, 303)
  t.is(headers.foo, 'baz')
  t.is(text, 'baz')
})
