const test = require('ava')

const {
  createServer
} = require('./fixtures/create')
const {
  generateSupportMessage
} = require('../src/error')

process.env.EGG_SSR_PAGES_TYPE = 'invalid_builtin_renderer'

test('invalid built-in render', async t => {
  const message = '"blah" is not a valid built-in renderer, only "next" is supported'
  return t.throwsAsync(() => createServer('normal'), message)
})

test('generate messages, 3 items', t => {
  const message = generateSupportMessage(['a', 'b', 'c'])
  t.is(message, 'only "a", "b" and "c" are supported')
})

test('generate messages, 2 items', t => {
  const message = generateSupportMessage(['a', 'c'])
  t.is(message, 'only "a" and "c" are supported')
})

test('generate messages, 1 item', t => {
  const message = generateSupportMessage(['a'])
  t.is(message, 'only "a" is supported')
})
