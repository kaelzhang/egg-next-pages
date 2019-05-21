const test = require('ava')
const {format} = require('util')

const {
  INVALID_GUARD,
  BUT_GOT
} = require('../src/error')

test('invalid guard', t =>
  t.throwsAsync(
    () => require('./fixtures/create').createFakeApp('invalid_guard'),
    format(INVALID_GUARD + BUT_GOT, 'haha')
  )
)
