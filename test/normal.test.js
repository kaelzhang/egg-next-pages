const test = require('ava')

let get

require('./fixtures/create')('normal', ({
  get: g
}) => {
  get = g
}, test)

test('normal: default setting', async t => {
  const {
    text,
    headers,
    statusCode
  } = await get('/home/en')

  t.is(statusCode, 200)
  t.true(text.includes(JSON.stringify({lang: 'en'})))

  const cacheControl = headers['cache-control']
  t.true(/max-age=0/.test(cacheControl))
})

test.only('no-cache', async t => {
  const {
    text,
    headers,
    statusCode
  } = await get('/no-cache')

  t.is(statusCode, 200)
  t.false(text.includes(JSON.stringify({lang: 'en'})))

  const cacheControl = headers['cache-control']
  t.true(/no-cache/.test(cacheControl))
})

test('normal: 404 page', async t => {
  const {
    statusCode
  } = await get('/foo/bar')

  t.is(statusCode, 404)
})
