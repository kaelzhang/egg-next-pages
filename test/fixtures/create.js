const path = require('path')
const {
  Server
} = require('roe-scripts')
const fs = require('fs-extra')
const tmp = require('tmp-promise')
const supertest = require('supertest')

const TEMPLATE = path.resolve(__dirname, 'template')

const createServer = async type => {
  process.env.EGG_SSR_PAGES_TYPE = type

  const {
    path: p
  } = await tmp.dir()

  const cwd = await fs.realpath(p)

  await fs.copy(TEMPLATE, cwd)

  const fixture = (...args) => path.resolve(cwd, ...args)

  const server = new Server({
    cwd,
    dev: true
  })

  await server.ready()
  const {
    app
  } = server

  const st = supertest(app.callback())

  return {
    server,
    fixture,
    request: pathname => st.get(pathname)
  }
}

module.exports = (type, callback, test) => {
  let close

  const create = () =>
    createServer(type)
    .then(ret => {
      callback(ret)
      return close = () => ret.server.close()
    })

  if (!test) {
    return create()
  }

  test.before(create)

  test.after(() => close())
}
