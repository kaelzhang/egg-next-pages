const test = require('ava')
const {format} = require('util')

const {
  INVALID_MIDDLEWARE,
  BUT_GOT
} = require('../src/error')

test('invalid middleware', t =>
  t.throwsAsync(
    () => require('./fixtures/create').createFakeApp('invalid_middleware'),
    format(INVALID_MIDDLEWARE + BUT_GOT, 'haha')
  )
)
