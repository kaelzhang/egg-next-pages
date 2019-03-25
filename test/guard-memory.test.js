const log = require('util').debuglog('egg-ssr-pages')
const test = require('ava')
const request = require('supertest')

const {
  createServer
} = require('./fixtures/create')

process.env.EGG_SSR_PAGES_TYPE = 'memory'

let normal

test.before(async () => {
  const {
    app
  } = await createServer('normal')

  normal = app
})

test('memory: default setting', async t => {
  const {
    text
  } = await request(normal.callback())
  .get('/home/en')
  .expect(200)

  log('response: %s', text)

  t.true(text.includes(JSON.stringify({lang: 'en'})))
})

test('memory: 404 page', async t => {
  await request(normal.callback())
  .get('/foo/bar')
  .expect(404)

  t.pass()
})
