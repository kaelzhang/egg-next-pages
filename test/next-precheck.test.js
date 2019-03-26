const test = require('ava')
const {Roe} = require('roe')

const {
  fixture
} = require('./fixtures/create')
const {
  NEXT_NOT_FOUND
} = require('../src/error')

test.serial('next precheck fails', t => t.throwsAsync(async () => {
  const app = new Roe({
    baseDir: fixture('normal'),
    title: 'normal'
  })

  await app.ready()
}, NEXT_NOT_FOUND))
