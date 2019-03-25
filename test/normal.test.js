const path = require('path')

const test = require('ava')
const {
  Server
} = require('roe-scripts')
const supertest = require('supertest')

const fixture = s => path.join(__dirname, 'fixtures', s)

let app

test.before(async () => {
  const server = new Server({
    cwd: fixture('normal'),
    dev: true
  })

  await server.ready()

  ;({
    app
  } = server)
})

test('default setting', async t => {
  await supertest(app.callback())
  .get('')

  t.pass()
})
