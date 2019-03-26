const test = require('ava')

const {
  createServer
} = require('./fixtures/create')

process.env.EGG_SSR_PAGES_TYPE = 'invalid_renderer_render'

test('invalid renderer.render', async t => {
  const message = 'renderer.render must be a function, but got true'
  return t.throwsAsync(() => createServer('normal'), message)
})
