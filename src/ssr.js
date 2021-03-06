const {ensureLeading} = require('pre-suf')
const {isString, isFunction} = require('core-util-is')

const {
  getRenderer,
  getGuardian,
  createContext,
  getCacheOptions,
  getExtraMiddlewares,
  getPageDef
} = require('./options')
const {
  handle
} = require('./response')
const {error} = require('./error')

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

const getPagePath = (entry, ctx) => {
  const pagePath = entry(ctx)

  if (!isString(pagePath)) {
    throw error('INVALID_ENTRY_RETURN_VALUE', pagePath)
  }

  return pagePath
}

const createRendererController = (render, contextExtends, entry) =>
  async ctx => {
    const pagePath = isFunction(entry)
      ? getPagePath(entry, ctx)
      : entry

    const context = contextExtends
      ? createContext(ctx, contextExtends)
      : ctx
    handle(ctx.res)
    return render(context, ensurePath(pagePath))
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
  guard: defaultGuardian,
  cache: defaultCacheOptions,
  middleware: defaultMiddlewares
}) => {
  const {
    precheck: rendererPrecheck,
    render
  } = getRenderer(renderer)
  const defaultGuard = getGuardian(defaultGuardian)

  const baseExtends = applyPrecheckContext(null, rendererPrecheck, app)

  const defaultGuardPreset = createGuardPreset(
    app,
    defaultGuard,
    baseExtends
  )

  Object.keys(pages).forEach(page => {
    const {
      entry,
      cache,
      middleware,
      guard
    } = getPageDef(pages[page])

    const middlewares = [
      ...getExtraMiddlewares(middleware || defaultMiddlewares),
      // Handle http response
      MIDDLEWARE.response(
        getCacheOptions(defaultCacheOptions, cache)
      )
    ]

    const {
      guardMiddleware,
      contextExtends
    } = guard
      // If custom guard found, the default guard should be overridden
      ? createGuardPreset(
        app,
        guard,
        baseExtends
      )
      : defaultGuardPreset

    if (guardMiddleware) {
      middlewares.push(guardMiddleware)
    }

    app.router.get(
      page,
      ...middlewares,
      createRendererController(render, contextExtends, entry)
    )
  })
}

module.exports = (pages = {}, config = {}) =>
  app => applySSRPages(app, pages, config)
