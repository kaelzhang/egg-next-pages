const {Errors} = require('err-object')

const {error, E} = new Errors()

const NEXT_NOT_FOUND = 'app.next not found, next instance should be added to egg app before router is about to load'
E('NEXT_NOT_FOUND', NEXT_NOT_FOUND)

E('INVALID_RENDERER', {
  message: 'options.renderer must be a function or a string, but got %s',
  ctor: TypeError
})

const generateSupportMessage = items => {
  if (items.length === 1) {
    return `only "${items[0]}" is supported`
  }

  const quoted = items.map(m => `"${m}"`)
  const last = quoted.pop()

  return `only ${quoted.join(', ')} and ${last} are supported`
}

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

module.exports = {
  error,
  E,
  generateSupportMessage,
  NEXT_NOT_FOUND
}
