/* eslint-disable import/no-unresolved */
const ssr = require('egg-ssr-pages')

const no_args = () => ssr()

const normal = () => ssr({
  '/home/:lang': 'index',
  '/no-cache': {
    entry: 'index',
    cache: false
  }
}, {

})

const max_age_60 = () => ssr({
  '/home/:lang': 'index'
}, {
  cache: {
    maxAge: 60000
  }
})

const cache_override = () => ssr({
  '/home/:lang': {
    entry: 'index',
    cache: {
      maxAge: 40000
    }
  }
}, {
  cache: {
    maxAge: 60000
  }
})

const memory = () => ssr({
  '/home/:lang': 'index',
  '/not-exists': {
    entry: 'not-exists'
  },
  '/home2/:lang': {
    entry: 'index',
    guard: ssr.memoryGuardian({
      max: 1
    })
  }
}, {
  guard: ssr.memoryGuardian({
    max: 1
  })
})

const query = () => ssr({
  '/home': 'index'
})

const invalid_builtin_renderer = () => ssr({}, {
  renderer: 'blah'
})

const no_renderer_precheck = () => ssr({
  '/home/:lang': 'index'
}, {
  renderer: {
    render () {
      return 'no-precheck'
    }
  }
})

const error_fallback = () => ssr({
  '/home/:lang': 'index'
}, {
  renderer: {
    render () {
      throw new Error('error')
    }
  },
  guard: {
    key () {
      return 'foo'
    },
    fallback (ctx, key, html, error) {
      if (
        error.message === 'error'
        && key === 'foo'
        && html === undefined
      ) {
        return 'fallback'
      }

      throw new Error('test fails')
    }
  }
})

let counter = 0

const memory_fallback = () => ssr({
  '/home/:lang': 'index'
}, {
  renderer: {
    render () {
      if (counter === 0) {
        counter ++
        return 'foo'
      }

      throw new Error('bar')
    }
  },

  guard: ssr.memoryGuardian({
    max: 1
  })
})

const invalid_renderer_precheck = () => ssr({}, {
  renderer: {
    // invalid
    precheck: true,
    render () {}
  }
})

const invalid_renderer_render = () => ssr({}, {
  renderer: {
    // invalid
    render: true
  }
})

const invalid_guard_fallback = () => ssr({}, {
  guard: {
    key () {
      return 'foo'
    },
    fallback: true
  }
})

const invalid_renderer = () => ssr({}, {
  renderer: null
})

const invalid_guard = () => ssr({}, {
  guard: 'haha'
})

const invalid_cache = () => ssr({
  '/foo/bar': 'not-exists'
}, {
  cache: 'haha'
})

const multiple_precheck = () => ssr({
  '/foo': 'hahaha'
}, {
  renderer: {
    precheck () {
      return {
        a: 1
      }
    },

    render () {
      return 'bar'
    }
  },
  guard: {
    precheck () {
      return {
        b: 1
      }
    },
    key () {
      return 'baz'
    },
    validateSSRResult (ctx) {
      return ctx.a === ctx.b
    },
    fallback () {
      throw new Error('booooom!')
    }
  }
})

const success_error = () => ssr({
  '/foo': 'hahaha'
}, {
  renderer: {
    render () {
      return 'bar'
    }
  },
  guard: {
    key () {
      return 'baz'
    },
    onSuccess () {
      throw new Error('boooom!')
    },
    fallback () {
      return 'baz'
    }
  }
})

const render_throw = () => ssr({
  '/foo': 'hahaha'
}, {
  renderer: {
    render () {
      throw new Error('booooooooom!')
    }
  },
  guard: {
    key () {
      return 'baz'
    },
    fallback () {
      return 'bar'
    }
  }
})

const set_header = () => ssr({
  '/foo': 'hahaha'
}, {
  renderer: {
    render (ctx) {
      const {
        res
      } = ctx

      res.statusCode = 404
      res.setHeader('foo', 'bar')

      return 'bar'
    }
  },
  guard: {
    key () {
      return 'baz'
    },
    validateSSRResult (ctx) {
      return ctx.res.statusCode === 200
    },
    fallback (ctx) {
      const {
        res
      } = ctx
      res.setHeader('foo', 'baz')
      res.statusCode = 303
      return 'baz'
    }
  }
})

const default_middleware = () => ssr({
  '/foo': 'index'
}, {
  middleware (ctx, next) {
    ctx.state.foo = 'foo'
    return next()
  },
  renderer: {
    render (ctx) {
      return ctx.state.foo
    }
  }
})

const middleware = () => {
  const m = [
    (ctx, next) => {
      ctx.state.foo = 'foo'
      return next()
    },

    (ctx, next) => {
      ctx.state.foo += '-bar'
      return next()
    }
  ]

  return ssr({
    '/foo': {
      entry: () => 'index',
      middleware: m
    },
    '/bar': [...m, 'index'],
    '/invalid': () => 1
  }, {
    renderer: {
      render (ctx) {
        return ctx.state.foo
      }
    }
  })
}

const invalid_middleware = () => ssr({
  '/foo': {
    entry: 'index',
    middleware: 'haha'
  }
}, {
  renderer: {
    render (ctx) {
      return ctx.state.foo
    }
  }
})

const invalid_entry = () => ssr({
  '/foo': {}
})

const TYPES = {
  no_args,
  normal,
  max_age_60,
  cache_override,
  memory,
  invalid_builtin_renderer,
  no_renderer_precheck,
  error_fallback,
  memory_fallback,
  invalid_renderer_precheck,
  invalid_renderer_render,
  invalid_guard_fallback,
  invalid_renderer,
  invalid_guard,
  invalid_cache,
  multiple_precheck,
  success_error,
  render_throw,
  set_header,
  default_middleware,
  middleware,
  invalid_middleware,
  invalid_entry,
  query
}

const type = process.env.EGG_SSR_PAGES_TYPE || 'normal'

module.exports = TYPES[type]()
