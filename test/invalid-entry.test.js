const test = require('ava')

test('invalid entry', async t =>
  t.throwsAsync(
    () => require('./fixtures/create').createFakeApp('invalid_entry'), {
      code: 'INVALID_ENTRY'
    })
)
