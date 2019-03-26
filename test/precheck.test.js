const test = require('ava')
const request = require('supertest')

const {
  createServer
} = require('./fixtures/create')

process.env.EGG_SSR_PAGES_TYPE = 'no_renderer_precheck'

let normal

test.before(async () => {
  const {
    app
  } = await createServer('normal')

  normal = app
})

test('no renderer precheck testing', async t => {
  const {
    text,
    statusCode
  } = await request(normal.callback())
  .get('/home/en')

  t.is(statusCode, 200)
  t.is(text, 'no-precheck')
})
