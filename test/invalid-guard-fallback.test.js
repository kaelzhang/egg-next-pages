const test = require('ava')

test('invalid guardian fallback', async t => {
  const message = 'guardian.fallback must be a function, but got `true`'
  return t.throwsAsync(
    () => require('./fixtures/create').createFakeApp('invalid_guard_fallback'), message)
})
