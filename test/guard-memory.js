const path = require('path')
const log = require('util').debuglog('egg-ssr-pages')
const test = require('ava')
const request = require('supertest')
const fs = require('fs-extra')

const {
  createServer,
  fixture
} = require('./fixtures/create')

process.env.EGG_SSR_PAGES_TYPE = 'memory'

let normal
let tmpFixture

test.before(async () => {
  const root = fixture('..', '..', 'egg-ssr-pages-test')
  tmpFixture = (...args) => path.join(root, 'normal', ...args)

  const dest = tmpFixture()

  await fs.ensureDir(dest)
  await fs.copy(fixture('normal'), dest)

  const {
    app
  } = await createServer(dest)

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
