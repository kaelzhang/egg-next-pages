const test = require('ava')

test('invalid page def', async t =>
  t.throwsAsync(
    () => require('./fixtures/create').createFakeApp('invalid_page_def'), {
      code: 'INVALID_PAGE_DEF'
    })
)
