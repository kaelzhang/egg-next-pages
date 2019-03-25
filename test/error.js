const log = require('util').debuglog('egg-ssr-pages')
const test = require('ava')
const supertest = require('supertest')

const {
  createServer
} = require('./fixtures/create')

test('default setting', async t => {
  const {app} = await createServer('normal')

  const {
    text
  } = supertest(app.callback()).get('/en')

  t.true(text.includes(JSON.stringify({lang: 'en'})))
})
