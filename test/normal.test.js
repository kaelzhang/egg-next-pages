const test = require('ava')
const request = require('supertest')
const fs = require('fs-extra')

const {
  createServer,
  fixture
} = require('./fixtures/create')

process.env.EGG_SSR_PAGES_TYPE = 'normal'

let normal

test.before(async () => {
  const root = fixture('normal')
  try {
    await fs.remove(fixture('normal', 'dist'))
  } catch (err) {
    /* eslint-disable no-console */
    console.warn('remove fails', err)
  }

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

  t.true(text.includes(JSON.stringify({lang: 'en'})))
})

test('normal: 404 page', async t => {
  const {
    statusCode
  } = await request(normal.callback())
  .get('/foo/bar')

  t.is(statusCode, 404)
})
