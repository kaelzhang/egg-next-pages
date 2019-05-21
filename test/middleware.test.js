const test = require('ava')

test('middleware', async t => {
  const {get} = await require('./fixtures/create')('middleware')

  const {
    text,
    statusCode
  } = await get('/foo')

  t.is(statusCode, 200)
  t.is(text, 'foo-bar')

  t.is((await get('/bar')).text, 'foo-bar')
})
