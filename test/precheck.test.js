const test = require('ava')

test('no renderer precheck testing', async t => {
  const {get} = await require('./fixtures/create')('no_renderer_precheck')

  const {
    text,
    statusCode
  } = await get('/home/en')

  t.is(statusCode, 200)
  t.is(text, 'no-precheck')
})
