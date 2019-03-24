const {Errors} = require('err-object')
const {
  AVAILABLE_RENDERERS,
  AVAILABLE_GUARDIANS
} = require('./options')

const {error, E} = new Errors()

E('NEXT_NOT_FOUND', 'app.next not found, next instance should be added to egg app before router is about to load')

E('INVALID_RENDERER', {
  message: 'options.render must be a function or a string',
  ctor: TypeError
})

const generateMessage = items => {
  if (items.length === 1) {
    return `"${items[0]}" is`
  }

  const quoted = items.map(m => `"${m}"`)
  const last = quoted.pop()

  return `${quoted.join(', ')} and ${last} are`
}

const INVALID_BUILTIN_RENDERER = `"%s" is not a valid built-in renderer, only ${
  generateMessage(AVAILABLE_RENDERERS)
} supported`
E('INVALID_BUILTIN_RENDERER', {
  message: INVALID_BUILTIN_RENDERER,
  ctor: TypeError
})

E('INVALID_GUARD', {
  message: 'options.guard must be an object or a string',
  ctor: TypeError
})

const INVALID_BUILTIN_GUARD = `"%s" is not a valid built-in guardian, only ${
  generateMessage(AVAILABLE_GUARDIANS)
} supported`
E('INVALID_BUILTIN_GUARD', {
  message: INVALID_BUILTIN_GUARD,
  ctor: TypeError
})

E('INVALID_GUARDIAN_PROP', {
  message: 'guardian.%s must be a function, but got %s',
  ctor: TypeError
})

E('GUARDIAN_VALIDATE_FAILS', 'the result is validated as a failure')

module.exports = error
