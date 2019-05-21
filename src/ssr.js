const {ensureLeading} = require('pre-suf')

const {
  getRenderer,
  getGuardian,
  createContext,
  getCacheOptions,
  getExtraMiddlewares
} = require('./options')
const {
  handle
} = require('./response')

const MIDDLEWARE = {
  guard: require('./middleware/guard'),
  response: require('./middleware/response')
}

const ensurePath = s => ensureLeading(s, '/')

const applyPrecheckContext = (baseExtends, precheck, app) => {
  if (!precheck) {
    return baseExtends
  }

  const precheckExtends = precheck(app)

  return baseExtends
    ? precheckExtends
      ? Object.assign({}, baseExtends, precheckExtends)
      : baseExtends
    : precheckExtends
}

const createRendererController = (render, contextExtends, pagePath) =>
  ctx => {
    const context = contextExtends
      ? createContext(ctx, contextExtends)
      : ctx
    handle(ctx.res)
    return render(context, pagePath)
  }

// Create guard middleware and context
const createGuardPreset = (app, guard, baseExtends) => {
  if (!guard) {
    return {
      // If no guard, we use the baseExtends
      contextExtends: baseExtends
    }
  }

  const {
    precheck,
    ...guardian
  } = guard

  const contextExtends = applyPrecheckContext(
    baseExtends,
    precheck,
    app
  )

  const guardMiddleware = MIDDLEWARE.guard(
    guardian,
    contextExtends
  )

  return {
    contextExtends,
    guardMiddleware
  }
}

// Ref:
// https://github.com/kaelzhang/egg-define-router#definerouterroutes-middlewareroot-factory
const applySSRPages = (app, pages, {
  renderer = 'next',
  guard,
  cache: defaultCacheOptions,
  middleware: defaultMiddlewares
}) => {
  const {
    precheck: rendererPrecheck,
    render
  } = getRenderer(renderer)
  const defaultGuard = getGuardian(guard)

  const baseExtends = applyPrecheckContext(null, rendererPrecheck, app)

  const defaultGuardPreset = createGuardPreset(
    app,
    defaultGuard,
    baseExtends
  )

  Object.keys(pages).forEach(page => {
    const def = pages[page]

    let entry
    let options = {}
    let middleware

    if (typeof def === 'string') {
      entry = def
    } else {
      ({
        entry,
        middleware,
        ...options
      } = def)
    }

    const middlewares = [
      ...getExtraMiddlewares(middleware || defaultMiddlewares),
      // Handle http response
      MIDDLEWARE.response(
        getCacheOptions(defaultCacheOptions, options.cache)
      )
    ]

    const {
      guardMiddleware,
      contextExtends
    } = options.guard
      // If custom guard found, the default guard should be overridden
      ? createGuardPreset(
        app,
        options.guard,
        baseExtends
      )
      : defaultGuardPreset

    if (guardMiddleware) {
      middlewares.push(guardMiddleware)
    }

    const pathname = ensurePath(entry)

    app.router.get(
      page,
      ...middlewares,
      createRendererController(render, contextExtends, pathname)
    )
  })
}

module.exports = (pages = {}, config = {}) =>
  app => applySSRPages(app, pages, config)
