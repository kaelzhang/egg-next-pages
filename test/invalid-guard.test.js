const test = require('ava')

const {
  createServer
} = require('./fixtures/create')
const {
  INVALID_GUARD
} = require('../src/error')

process.env.EGG_SSR_PAGES_TYPE = 'invalid_guard'

test('invalid guard', t =>
  t.throwsAsync(() => createServer('normal'), INVALID_GUARD))
