const test = require('ava')

test('no args', async t => {
  const {get} = await require('./fixtures/create')('no_args')

  await get('/home/en')
  .expect(404)

  t.pass()
})
