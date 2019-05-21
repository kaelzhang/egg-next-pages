const test = require('ava')

test('invalid renderer.render', async t => {
  const message = 'renderer.render must be a function, but got `true`'
  return t.throwsAsync(
    () => require('./fixtures/create')('invalid_renderer_render'), message)
})
