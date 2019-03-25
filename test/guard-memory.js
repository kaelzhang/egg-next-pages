const path = require('path')
const log = require('util').debuglog('egg-ssr-pages')
const test = require('ava')
const request = require('supertest')
const tmp = require('tmp-promise')
const fs = require('fs-extra')

const {
  createServer,
  fixture
} = require('./fixtures/create')

process.env.EGG_SSR_PAGES_TYPE = 'memory'

let normal
let tmpFixture

test.before(async () => {
  const {
    path: root
  } = await tmp.dir()
  tmpFixture = (s = '.') => path.join(root, 'normal', s)

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
