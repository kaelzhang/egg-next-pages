const test = require('ava')
const request = require('supertest')

const {
  createServer
} = require('./fixtures/create')

process.env.EGG_SSR_PAGES_TYPE = 'error_fallback'

let normal

test.before(async () => {
  const {
    app
  } = await createServer('normal')

  normal = app
})

test('renderer error -> fallback', async t => {
  const {
    text,
    statusCode
  } = await request(normal.callback())
  .get('/home/en')

  t.is(statusCode, 200)
  t.is(text, 'fallback')
})
