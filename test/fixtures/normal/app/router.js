/* eslint-disable import/no-unresolved */
const ssr = require('egg-ssr-pages')

const normal = () => ssr({
  '/home/:lang': 'index'
}, {

})

const memory = () => ssr({
  '/home/:lang': 'index',
  '/not-exists': 'not-exists'
}, {
  guard: ssr.memoryGuardian({
    max: 1
  })
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

const TYPES = {
  normal,
  memory,
  invalid_builtin_renderer,
  no_renderer_precheck,
  error_fallback,
  memory_fallback
}

const type = process.env.EGG_SSR_PAGES_TYPE || 'normal'

module.exports = TYPES[type]()
