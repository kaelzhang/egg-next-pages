const test = require('ava')

let get

require('./fixtures/create')('memory_fallback', ({
  get: g
}) => {
  get = g
}, test)

test.serial('renderer error, success for the first time', async t => {
  const {
    text,
    statusCode
  } = await get('/home/en')

  t.is(statusCode, 200)
  t.is(text, 'foo')
})

test.serial('renderer error -> memory guard', async t => {
  const {
    text,
    statusCode
  } = await get('/home/en')

  t.is(statusCode, 200)
  t.is(text, 'foo')
})

test.serial('renderer error -> memory guard not hit', async t => {
  const {
    statusCode
  } = await get('/home/us')

  t.is(statusCode, 500)
})
