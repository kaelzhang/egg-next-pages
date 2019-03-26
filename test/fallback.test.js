const test = require('ava')

test('renderer error -> fallback', async t => {
  const {get} = await require('./fixtures/create')('error_fallback')

  const {
    text,
    statusCode
  } = await get('/home/en')

  t.is(statusCode, 200)
  t.is(text, 'fallback')
})
