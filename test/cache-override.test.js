const test = require('ava')
const request = require('supertest')

const {
  createServer,
} = require('./fixtures/create')

process.env.EGG_SSR_PAGES_TYPE = 'cache_override'

test('cache override -> max-age=40', async t => {
  const {app} = await createServer('normal')

  const {
    text,
    headers
  } = await request(app.callback())
  .get('/home/en')
  .expect(200)

  t.true(text.includes(JSON.stringify({lang: 'en'})))

  const cacheControl = headers['cache-control']
  t.true(/max-age=40\b/.test(cacheControl))
})
