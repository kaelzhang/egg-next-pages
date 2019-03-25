// To avoid circular dependencies

const RENDERER = {
  next: require('./renderer/next')
}

const AVAILABLE_RENDERERS = Object.keys(RENDERER)

module.exports = {
  RENDERER,
  AVAILABLE_RENDERERS
}
