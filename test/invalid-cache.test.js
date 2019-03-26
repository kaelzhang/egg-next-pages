const test = require('ava')

const {
  INVALID_CACHE
} = require('../src/error')

test('invalid cache', t =>
  t.throwsAsync(
    () => require('./fixtures/create')('invalid_cache'), INVALID_CACHE))
