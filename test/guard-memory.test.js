const path = require('path')
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
  const root = path.join(__dirname, '..', '..', 'egg-ssr-pages-test')
  tmpFixture = (...args) => path.join(root, 'normal', ...args)

  const dest = tmpFixture()

  await fs.remove(dest)
  await fs.ensureDir(dest)
  await fs.copy(fixture('normal'), dest)
  try {
    await fs.remove(tmpFixture('dist'))
  } catch (err) {
    /* eslint-disable no-console */
    console.warn('remove fails', err)
  }

  const {
    app
  } = await createServer(dest)

  normal = app
})

test.serial('memory: 404 page', async t => {
  await request(normal.callback())
  .get('/foo/bar')
  .expect(404)

  t.pass()
})

test.serial('memory: default setting', async t => {
  const {
    text,
    statusCode,
    headers
  } = await request(normal.callback())
  .get('/home/en')

  t.is(headers['x-ssr-guard'], 'no')
  t.is(statusCode, 200)
  t.true(text.includes(JSON.stringify({lang: 'en'})))
})

test.serial('not found, but guard', async t => {
  await fs.remove(tmpFixture('pages', 'index.js'))

  const {
    statusCode,
    headers,
    text
  } = await request(normal.callback())
  .get('/home/en')

  t.is(headers['x-ssr-guard'], 'yes')
  t.is(statusCode, 200)
  t.true(text.includes(JSON.stringify({lang: 'en'})))
})

test.serial('no found, no guard', async t => {
  const {
    statusCode
  } = await request(normal.callback())
  .get('/home/cn')

  t.is(statusCode, 404)
})
