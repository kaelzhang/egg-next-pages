const test = require('ava')
const request = require('supertest')

const {
  createServer
} = require('./fixtures/create')

process.env.EGG_SSR_PAGES_TYPE = 'memory_fallback'

let normal

test.before(async () => {
  const {
    app
  } = await createServer('normal')

  normal = app
})

test.serial('renderer error, success for the first time', async t => {
  const {
    text,
    statusCode
  } = await request(normal.callback())
  .get('/home/en')

  t.is(statusCode, 200)
  t.is(text, 'foo')
})

test.serial('renderer error -> memory guard', async t => {
  const {
    text,
    statusCode
  } = await request(normal.callback())
  .get('/home/en')

  t.is(statusCode, 200)
  t.is(text, 'foo')
})

test.serial('renderer error -> memory guard not hit', async t => {
  const {
    statusCode
  } = await request(normal.callback())
  .get('/home/us')

  t.is(statusCode, 500)
})
