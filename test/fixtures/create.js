const path = require('path')
const fs = require('fs-extra')
const tmp = require('tmp-promise')
const supertest = require('supertest')
const {Roe} = require('roe')
const createNext = require('next')

const TEMPLATE = path.resolve(__dirname, 'template')

const prepareApp = async (cwd, next = {}) => {
  const app = new Roe({
    extends: {
      next
    },
    baseDir: cwd
  })

  await app.ready()

  return app
}

const DEFAULT_CREATE_APP = async (cwd, type) => {
  const next = createNext({
    dev: true,
    dir: cwd,
    conf: {
      distDir: `.next-${type}`,
      assetPrefix: ''
    }
  })

  await next.prepare()

  return prepareApp(cwd, next)
}

const prepare = async (type, copy) => {
  process.env.EGG_SSR_PAGES_TYPE = type

  if (!copy) {
    return TEMPLATE
  }

  const {
    path: p
  } = await tmp.dir()

  const cwd = await fs.realpath(p)

  await fs.copy(TEMPLATE, cwd)

  return cwd
}

const createAgent = async (type, create, copy) => {
  const cwd = await prepare(type, copy)

  const fixture = (...args) => path.resolve(cwd, ...args)

  const app = await create(cwd, type)
  const st = supertest(app.callback())

  return {
    fixture,
    get: pathname => st.get(pathname)
  }
}

const createFakeApp = async type => {
  const cwd = await prepare(type)
  return prepareApp(cwd)
}

module.exports = (type, callback, test, copy) => {
  const create = () =>
    createAgent(type, DEFAULT_CREATE_APP, copy)
    .then(ret => {
      callback && callback(ret)
      return ret
    })

  if (!test) {
    return create()
  }

  test.before(create)
}

module.exports.prepare = prepare
module.exports.createFakeApp = createFakeApp
module.exports.TEMPLATE = TEMPLATE
