const test = require('ava')

test('invalid renderer', async t => {
  const message = 'options.renderer must be an object or a string, but got `null`'
  return t.throwsAsync(
    () => require('./fixtures/create')('invalid_renderer'), message)
})
