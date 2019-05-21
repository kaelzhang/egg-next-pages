const test = require('ava')
const {format} = require('util')

const {
  INVALID_CACHE,
  BUT_GOT
} = require('../src/error')

test('invalid cache', t =>
  t.throwsAsync(
    () => require('./fixtures/create').createFakeApp('invalid_cache'),
    format(INVALID_CACHE + BUT_GOT, 'haha')
  )
)
