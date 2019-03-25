const log = require('util').debuglog('egg-ssr-pages')
const test = require('ava')
const request = require('supertest')

const {
  createServer
} = require('./fixtures/create')

let normal

test.before(async () => {
  const {
    app
  } = await createServer('normal')

  normal = app
})

test('default setting', async t => {
  const {
    text
  } = await request(normal.callback())
  .get('/en')
  .expect(200)

  log('response: %s', text)

  t.true(text.includes(JSON.stringify({lang: 'en'})))
})

test('404 page', async t => {
  await request(normal.callback())
  .get('/foo/bar')
  .expect(404)

  t.pass()
})
