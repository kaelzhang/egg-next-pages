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

// Ref:
// https://github.com/kaelzhang/egg-define-router#definerouterroutes-middlewareroot-factory
const applySSRPages = (app, pages, {
  renderer,
  guard,
  cache = {}
}) => {
  const {
    precheck,
    render
  } = getRenderer(renderer)
  const defaultGuard = gerGardian(guard)

  let defaultExtends

  if (precheck) {
    defaultExtends = precheck(app)
  }

  let defualtGuardMiddleware
  if (defaultGuard) {
    if (guardian.precheck) {
      const
    }

    defualtGuardMiddleware = MIDDLEWARE.guard(guardian)
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

    const pathname = ensurePath(entry)

    const middlewares = [
      // Handle http response
      middleware.response(options)
    ]

    const {
      cache
    } = options

    if (guard !== false) {
      // Handle caches
      middlewares.push(middleware.guard(app, {
        cache,
        pathname
      }))
    }

    router.get(
      page,
      ...middlewares,
      createNextController(app, next, pathname)
    )
  })
}

module.exports = ({
  pages = {},
  ...config
}) => app => applySSR(app, pages, config)
