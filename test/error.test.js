const test = require('ava')

const {createFakeApp} = require('./fixtures/create')
const {
  generateSupportMessage
} = require('../src/error')

test('invalid built-in render', async t => {
  const message = '"blah" is not a valid built-in renderer, only "next" is supported'
  return t.throwsAsync(() => createFakeApp('invalid_builtin_renderer'), message)
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
