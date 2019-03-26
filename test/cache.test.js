const test = require('ava')

test('cache max-age=60', async t => {
  const {get} = await require('./fixtures/create')('max_age_60')

  const {
    text,
    headers
  } = await get('/home/en')
  .expect(200)

  t.true(text.includes(JSON.stringify({lang: 'en'})))

  const cacheControl = headers['cache-control']
  t.true(/max-age=60\b/.test(cacheControl))
})
