const {Errors} = require('err-object')
const {
  AVAILABLE_RENDERERS
} = require('./renderer')

const {error, E} = new Errors()

E('NEXT_NOT_FOUND', 'app.next not found, next instance should be added to egg app before router is about to load')

E('INVALID_RENDERER', {
  message: 'options.renderer must be a function or a string, but got %s',
  ctor: TypeError
})

const generateMessage = items => {
  if (items.length === 1) {
    return `only "${items[0]}" is`
  }

  const quoted = items.map(m => `"${m}"`)
  const last = quoted.pop()

  return `only ${quoted.join(', ')} and ${last} are`
}

const INVALID_BUILTIN_RENDERER = `"%s" is not a valid built-in renderer, ${
  generateMessage(AVAILABLE_RENDERERS)
} supported`
E('INVALID_BUILTIN_RENDERER', {
  message: INVALID_BUILTIN_RENDERER,
  ctor: TypeError
})

E('INVALID_GUARD', {
  message: 'options.guard must be an object',
  ctor: TypeError
})

E('INVALID_GUARDIAN_PROP', {
  message: 'guardian.%s must be a function, but got %s',
  ctor: TypeError
})

E('INVALID_RENDERER_PROP', {
  message: 'renderer.%s must be a function, but got %s',
  ctor: TypeError
})

E('GUARDIAN_VALIDATE_FAILS', 'the result is validated as a failure')

module.exports = error
