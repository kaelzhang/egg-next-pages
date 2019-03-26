const test = require('ava')

const {
  createServer
} = require('./fixtures/create')

process.env.EGG_SSR_PAGES_TYPE = 'invalid_renderer'

test('invalid renderer', async t => {
  const message = 'options.renderer must be an object or a string, but got null'
  return t.throwsAsync(() => createServer('normal'), message)
})
