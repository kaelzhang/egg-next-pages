const test = require('ava')

test('invalid renderer.precheck', async t => {
  const message = 'renderer.precheck must be a function, but got `true`'
  return t.throwsAsync(
    () => require('./fixtures/create')('invalid_renderer_precheck'), message)
})
