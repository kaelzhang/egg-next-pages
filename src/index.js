const {ensureLeading} = require('pre-suf')

const error = require('./error')
const {
  getRenderer,
  createContext
} = require('./options')

const MIDDLEWARE = {
  guard: require('./middleware/guard'),
  response: require('./middleware/page-response')
}

const ensurePath = s => ensureLeading(s, '/')
const isPlainObject = object => Object.keys(object).length === 0

const applyPrecheck = (ext, precheck, app, createNew) => {
  if (!precheck) {
    return
  }

  return createNew
    ? Object.assign({}, ext, precheck(app))
    : Object.assign(ext, precheck(app))
}

const createRendererController = (render, contextExtends, pagePath) =>
  ctx => {
    const context = createContext(ctx, contextExtends)
    return render(context, pagePath)
  }

// Ref:
// https://github.com/kaelzhang/egg-define-router#definerouterroutes-middlewareroot-factory
const applySSRPages = (app, pages, {
  renderer,
  guard,
  cache = {}
}) => {
  const {
    precheck: rendererPrecheck,
    render
  } = getRenderer(renderer)
  const defaultGuard = gerGardian(guard)

  const baseExtends = applyPrecheck({}, rendererPrecheck, app)

  let defualtGuardMiddleware
  let defaultExtends
  if (defaultGuard) {
    const {
      precheck: defaultPrecheck,
      ...defaultGuardian
    } = defaultGuard

    defaultExtends = applyPrecheck(
      baseExtends,
      defaultPrecheck,
      app,
      true
    )

    defualtGuardMiddleware = MIDDLEWARE.guard(defaultGuardian)
  }

  // {
  //   '/some/path': {
  //     entry: 'some-page',
  //     cache: true
  //   }
  // }
  Object.keys(pages).forEach(page => {
    const def = pages[page]

    let entry
    let options

    if (typeof def === 'string') {
      entry = def
    } else {
      {
        entry,
        ...options
      } = def
    }

    const {
      cache,
      guard
    } = options

    const middlewares = [
      // Handle http response
      middleware.response(cache)
    ]

    let contextExtends = defaultExtends

    if (guard !== false) {
      const {
        precheck,
        ...guardian
      } = guard

      contextExtends = applyPrecheck(baseExtends, precheck, app, true)

      // Handle caches
      middlewares.push(
        middleware.guard(guardian, contextExtends)
      )
    }

    const pathname = ensurePath(entry)

    router.get(
      page,
      ...middlewares,
      createRendererController(render, contextExtends, pathname)
    )
  })
}

module.exports = ({
  pages = {},
  ...config
}) => app => applySSR(app, pages, config)
