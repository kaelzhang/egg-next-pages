// To avoid circular dependencies
const {
  E,
  generateSupportMessage
} = require('./error')

const RENDERER = {
  next: require('./renderer/next')
}

const AVAILABLE_RENDERERS = Object.keys(RENDERER)

const INVALID_BUILTIN_RENDERER = `"%s" is not a valid built-in renderer, ${
  generateSupportMessage(AVAILABLE_RENDERERS)
}`

E('INVALID_BUILTIN_RENDERER', {
  message: INVALID_BUILTIN_RENDERER,
  ctor: TypeError
})

module.exports = {
  RENDERER,
  AVAILABLE_RENDERERS
}
