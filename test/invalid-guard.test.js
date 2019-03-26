const test = require('ava')

const {
  INVALID_GUARD
} = require('../src/error')

test('invalid guard', t =>
  t.throwsAsync(
    () => require('./fixtures/create')('invalid_guard'), INVALID_GUARD))
