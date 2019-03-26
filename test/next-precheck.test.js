const test = require('ava')
const {Roe} = require('roe')

const {
  TEMPLATE
} = require('./fixtures/create')

const {
  NEXT_NOT_FOUND
} = require('../src/error')

test.serial('next precheck fails', async t =>
  t.throwsAsync(async () => {
    const app = new Roe({
      baseDir: TEMPLATE,
      title: 'normal'
    })

    await app.ready()
  }, NEXT_NOT_FOUND)
)
