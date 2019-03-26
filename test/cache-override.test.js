const test = require('ava')

test('cache override -> max-age=40', async t => {
  const {get} = await require('./fixtures/create')('cache_override')

  const {
    text,
    headers
  } = await get('/home/en')
  .expect(200)

  t.true(text.includes(JSON.stringify({lang: 'en'})))

  const cacheControl = headers['cache-control']
  t.true(/max-age=40\b/.test(cacheControl))
})
