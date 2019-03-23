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

const GUARDIANS = {
  memory: require('./guard/memory')
}

const AVAILABLE_GUARDIANS = Object.keys(GUARDIANS)

const ensureFunction = (host, key) => {
  const value = host[key]
  if (typeof value === 'function') {
    return
  }

  throw error('INVALID_GUARDIAN_PROP', key, value)
}

const checkGuardian = guard => {
  ensureFunction(guard, 'precheck')
  ensureFunction(guard, 'key')
  ensureFunction(guard, 'onSuccess')
  ensureFunction(guard, 'validateSSRResult')
  ensureFunction(guard, 'fallback')
}

const getGuardian = guard => {
  if (Object(guard) === guard) {
    checkGuardian(guard)
    return guard
  }

  if (typeof guard !== 'string') {
    throw error('INVALID_GUARD', guard)
  }

  if (!AVAILABLE_GUARDIANS.includes(guard)) {
    throw error('INVALID_BUILTIN_GUARD')
  }

  return GUARDIANS[guard]
}

module.exports = {
  getRenderer,
  AVAILABLE_RENDERERS,

  getGuardian,
  AVAILABLE_GUARDIANS
}
