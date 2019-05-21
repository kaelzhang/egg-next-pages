const path = require('path')
const fs = require('fs-extra')
const tmp = require('tmp-promise')
const supertest = require('supertest')
const {Roe} = require('roe')
const createNext = require('next')

const TEMPLATE = path.resolve(__dirname, 'template')

const DEFAULT_CREATE_APP = async cwd => {
  const next = createNext({
    dev: true,
    dir: cwd,
    conf: {
      distDir: 'dist',
      assetPrefix: ''
    }
  })

  await next.prepare()

  const app = new Roe({
    extends: {
      next
    },
    baseDir: cwd
  })

  await app.ready()

  return app
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

const createApp = async (type, create, copy) => {
  const cwd = await prepare(type, copy)

  const fixture = (...args) => path.resolve(cwd, ...args)

  const app = await create(cwd)
  const st = supertest(app.callback())

  return {
    fixture,
    get: pathname => st.get(pathname)
  }
}

module.exports = (type, callback, test, copy) => {
  const create = () =>
    createApp(type, DEFAULT_CREATE_APP, copy)
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
module.exports.TEMPLATE = TEMPLATE
