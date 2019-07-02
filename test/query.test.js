const test = require('ava')

test('url query', async t => {
  const {get} = await require('./fixtures/create')('query')

  const {text} = await get('/home?lang=en')

  t.true(text.includes('<div id="lang">en</div>'))
})
