const {ensureLeading} = require('pre-suf')

const {
  getRenderer,
  getGuardian,
  createContext
} = require('./options')

const MIDDLEWARE = {
  guard: require('./middleware/guard'),
  response: require('./middleware/response')
}

const ensurePath = s => ensureLeading(s, '/')

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

const createGuardMiddleware = (app, guard, baseExtends) => {
  if (!guard) {
    return
  }

  const {
    precheck,
    ...guardian
  } = guard

  const contextExtends = applyPrecheck(
    baseExtends,
    precheck,
    app,
    true
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
  renderer,
  guard,
  cache = {}
}) => {
  const {
    precheck: rendererPrecheck,
    render
  } = getRenderer(renderer)
  const defaultGuard = getGuardian(guard)

  const baseExtends = applyPrecheck({}, rendererPrecheck, app)

  const defaultPreset = createGuardMiddleware(
    app,
    defaultGuard,
    baseExtends
  )

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
      ({
        entry,
        ...options
      } = def)
    }

    const middlewares = [
      // Handle http response
      MIDDLEWARE.response(Object.assign({}, cache, options.cache))
    ]

    const {
      guardMiddleware,
      contextExtends
    } = options.guard
      // If custom guard found, the default guard should be overridden
      ? createGuardMiddleware(
        app,
        options.guard,
        baseExtends
      )
      : defaultPreset

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

module.exports = ({
  pages = {},
  ...config
}) => app => applySSRPages(app, pages, config)
