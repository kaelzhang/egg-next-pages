const test = require('ava')

test('error thrown in onSuccess', async t => {
  const {get} = await require('./fixtures/create')('success_error')

  const {
    text,
    statusCode
  } = await get('/foo')

  t.is(statusCode, 200)
  t.is(text, 'baz')
})
