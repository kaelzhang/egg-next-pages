const {isArray, isFunction, isString} = require('core-util-is')
const {error} = require('./error')
const {
  AVAILABLE_RENDERERS,
  RENDERER
} = require('./renderer')

const isObject = object => Object(object) === object
const isUndefined = s => s === undefined

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
  if (!host[key] && defaultValue) {
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

const convertCacheOptions = (options, onUndefined) => {
  if (options === false || isObject(options)) {
    return options
  }

  if (isUndefined(options)) {
    return onUndefined()
  }

  throw error('INVALID_CACHE', options)
}

//                               dO
//                 | undefined  | false   | object
// --------------- | ---------- | ------- | --------
// o   undefined   | {}         | dO      | dO
//     false       | o          | o       | o
//     object      | o          | o       | o

const getCacheOptions = (defaultOptions, options) =>
  convertCacheOptions(
    options,
    () => convertCacheOptions(defaultOptions, () => ({}))
  )

const getExtraMiddlewares = middleware => {
  if (!middleware) {
    return []
  }

  if (isFunction(middleware)) {
    return [middleware]
  }

  if (!isArray(middleware) || !middleware.every(isFunction)) {
    throw error('INVALID_MIDDLEWARE', middleware)
  }

  return middleware
}

const getPageDef = def => {
  let definition

  if (isString(def)) {
    definition = {
      entry: def
    }
  } else if (isArray(def)) {
    const entry = def.pop()
    definition = {
      entry,
      middleware: def
    }
  } else if (isObject(def)) {
    definition = def
  } else {
    throw error('INVALID_PAGE_DEF', def)
  }

  if (!isString(definition.entry)) {
    throw error('INVALID_ENTRY', definition.entry)
  }

  return definition
}

module.exports = {
  getRenderer,
  AVAILABLE_RENDERERS,

  getGuardian,
  createContext,

  getCacheOptions,
  getExtraMiddlewares,
  getPageDef
}
