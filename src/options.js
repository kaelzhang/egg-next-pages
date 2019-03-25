const error = require('./error')

const RENDERER = {
  next: require('./renderer/next')
}

const AVAILABLE_RENDERERS = Object.keys(RENDERER)

const getRenderer = render => {
  if (typeof render === 'function') {
    return {
      render
    }
  }

  if (typeof render !== 'string') {
    throw error('INVALID_RENDERER')
  }

  if (!AVAILABLE_RENDERERS.includes(render)) {
    throw error('INVALID_BUILTIN_RENDERER', render)
  }

  return RENDERER[render]
}

const ensureFunction = (host, key, defaultValue) => {
  if (!(key in host) && defaultValue) {
    host[key] = defaultValue
    return
  }

  const value = host[key]
  if (typeof value === 'function') {
    return
  }

  throw error('INVALID_GUARDIAN_PROP', key, value)
}

const NOOP = () => {}
const RETURNS_TRUE = () => true
const checkGuardian = guard => {
  ensureFunction(guard, 'precheck', NOOP)
  ensureFunction(guard, 'key')
  ensureFunction(guard, 'validateSSRResult', RETURNS_TRUE)
  ensureFunction(guard, 'onSuccess', NOOP)
  ensureFunction(guard, 'fallback')
}

const getGuardian = guard => {
  // Disable guard
  if (!guard) {
    return
  }

  if (Object(guard) === guard) {
    checkGuardian(guard)
    return guard
  }

  throw error('INVALID_GUARD', guard)
}

const createContext = (ctx, contextExtends) => ({
  ...contextExtends,
  __proto__: ctx
})

module.exports = {
  getRenderer,
  AVAILABLE_RENDERERS,

  getGuardian,
  createContext
}
