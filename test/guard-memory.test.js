const test = require('ava')
const fs = require('fs-extra')

let get
let fixture

require('./fixtures/create')('memory', ({
  get: g,
  fixture: f
}) => {
  get = g
  fixture = f
}, test, true)

test.serial('memory: 404 page', async t => {
  await get('/foo/bar')
  .expect(404)

  t.pass()
})

test.serial('memory: default setting', async t => {
  const {
    text,
    statusCode,
    headers
  } = await get('/home/en')

  t.is(headers['x-ssr-guard'], 'no')
  t.is(statusCode, 200)
  t.true(text.includes(JSON.stringify({lang: 'en'})))
})

test.serial('not found, but guard', async t => {
  await fs.remove(fixture('pages', 'index.js'))

  const {
    statusCode,
    headers,
    text
  } = await get('/home/en')

  t.is(headers['x-ssr-guard'], 'yes')
  t.is(statusCode, 200)
  t.true(text.includes(JSON.stringify({lang: 'en'})))
})

test.serial('no found, no guard', async t => {
  const {
    statusCode
  } = await get('/home/cn')

  t.is(statusCode, 404)
})
