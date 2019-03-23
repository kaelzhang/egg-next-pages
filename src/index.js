const {ensureLeading} = require('pre-suf')

const error = require('./error')
const {
  getRenderer
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
  const guardian = gerGardian(guard)

  let extends

  if (precheck) {
    extends = precheck(app)
  }

  // {
  //   '/some/path': {
  //     entry: 'some-page',
  //     cache: true
  //   }
  // }
  Object.keys(pages).forEach(page => {
    const def = pages[page]
    const {
      entry,
      ...options
    } = typeof def === 'string'
      ? {
        entry: def
      }
      : def

    const pathname = ensurePath(entry)

    const middlewares = [
      // Handle http response
      middleware.response(options)
    ]

    const {
      cache
    } = options

    if (cache !== false) {
      // Handle caches
      middlewares.push(middleware.cache(app, {
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
