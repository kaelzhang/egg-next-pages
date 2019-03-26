const test = require('ava')

const {
  createServer
} = require('./fixtures/create')
const {
  INVALID_CACHE
} = require('../src/error')

process.env.EGG_SSR_PAGES_TYPE = 'invalid_cache'

test('invalid cache', t =>
  t.throwsAsync(() => createServer('normal'), INVALID_CACHE))
