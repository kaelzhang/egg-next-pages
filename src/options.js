const {error} = require('./error')
const {
  AVAILABLE_RENDERERS,
  RENDERER
} = require('./renderer')

const isObject = object => Object(object) === object

const checkRendererFunction = (host, key, required) => {
  const fn = host[key]

  if (!fn && !required) {
    return
  }

  if (typeof fn !== 'function') {
    throw error('INVALID_RENDERER_PROP', key, fn)
  }
}

const getRenderer = renderer => {
  if (isObject(renderer)) {
    checkRendererFunction(renderer, 'precheck')
    checkRendererFunction(renderer, 'render', true)
    return renderer
  }

  if (typeof renderer !== 'string') {
    throw error('INVALID_RENDERER', renderer)
  }

  if (!AVAILABLE_RENDERERS.includes(renderer)) {
    throw error('INVALID_BUILTIN_RENDERER', renderer)
  }

  return RENDERER[renderer]
}

const ensureGuardFunction = (host, key, defaultValue) => {
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
  ensureGuardFunction(guard, 'precheck', NOOP)
  ensureGuardFunction(guard, 'key')
  ensureGuardFunction(guard, 'validateSSRResult', RETURNS_TRUE)
  ensureGuardFunction(guard, 'onSuccess', NOOP)
  ensureGuardFunction(guard, 'fallback')
}

const getGuardian = guard => {
  // Disable guard
  if (!guard) {
    return
  }

  if (isObject(guard)) {
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
