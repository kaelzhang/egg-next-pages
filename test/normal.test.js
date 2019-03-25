const log = require('util').debuglog('egg-ssr-pages')
const test = require('ava')
const request = require('supertest')

const {
  createServer,
  fixture
} = require('./fixtures/create')

process.env.EGG_SSR_PAGES_TYPE = 'normal'

let normal

test.before(async () => {
  const root = fixture('normal')

  const {
    app
  } = await createServer(root)

  normal = app
})

test('normal: default setting', async t => {
  const {
    text
  } = await request(normal.callback())
  .get('/home/en')
  .expect(200)

  log('response: %s', text)

  t.true(text.includes(JSON.stringify({lang: 'en'})))
})

test('normal: 404 page', async t => {
  await request(normal.callback())
  .get('/foo/bar')
  .expect(404)

  t.pass()
})
