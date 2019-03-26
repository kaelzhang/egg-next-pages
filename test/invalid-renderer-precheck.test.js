const test = require('ava')

const {
  createServer
} = require('./fixtures/create')

process.env.EGG_SSR_PAGES_TYPE = 'invalid_renderer_precheck'

test('invalid renderer.precheck', async t => {
  const message = 'renderer.precheck must be a function, but got true'
  return t.throwsAsync(() => createServer('normal'), message)
})
