const test = require('ava')
const request = require('supertest')

const {
  createServer,
} = require('./fixtures/create')

process.env.EGG_SSR_PAGES_TYPE = 'no_args'

test('no args', async t => {
  const {app} = await createServer('normal')

  await request(app.callback())
  .get('/home/en')
  .expect(404)

  t.pass()
})
