const test = require('ava')

const {
  createServer
} = require('./fixtures/create')

process.env.EGG_SSR_PAGES_TYPE = 'invalid_guard_fallback'

test('invalid guardian fallback', async t => {
  const message = 'guardian.fallback must be a function, but got true'
  return t.throwsAsync(() => createServer('normal'), message)
})
