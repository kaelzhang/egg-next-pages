const {ensureLeading} = require('pre-suf')

const error = require('./error')

const middleware = {
  cache: require('./middleware/cache'),
  response: require('./middleware/page-response')
}

const createNextController = (app, next, pathname) =>
  async ctx => {
    const {
      req, res, params
    } = ctx

    return {
      html: await next.renderToHTML(req, res, pathname, params)
    }
  }

const ensurePath = s => ensureLeading(s, '/')

// Ref:
// https://github.com/kaelzhang/egg-define-router#definerouterroutes-middlewareroot-factory
const applyNextPages = (app, pages) => {
  const {
    router,
    next
  } = app

  if (!next) {
    throw error('NEXT_NOT_FOUND')
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
