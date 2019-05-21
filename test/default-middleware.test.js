const test = require('ava')

test('default middleware', async t => {
  const {get} = await require('./fixtures/create')('default_middleware')

  const {
    text,
    statusCode
  } = await get('/foo')

  t.is(statusCode, 200)
  t.is(text, 'foo')
})
