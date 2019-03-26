const test = require('ava')

test('no renderer precheck testing', async t => {
  const {get} = await require('./fixtures/create')('multiple_precheck')

  const {
    text,
    statusCode
  } = await get('/foo')

  t.is(statusCode, 200)
  t.is(text, 'bar')
})
