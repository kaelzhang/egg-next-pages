const {Errors} = require('err-object')

const {error, E} = new Errors()

const NEXT_NOT_FOUND = 'app.next not found, next instance should be added to egg app before router is about to load'
E('NEXT_NOT_FOUND', NEXT_NOT_FOUND)

const BUT_GOT = ', but got `%s`'
const EE = (code, message) => E(code, message + BUT_GOT, TypeError)

EE('INVALID_RENDERER',
  'options.renderer must be an object or a string')

const generateSupportMessage = items => {
  if (items.length === 1) {
    return `only "${items[0]}" is supported`
  }

  const quoted = items.map(m => `"${m}"`)
  const last = quoted.pop()

  return `only ${quoted.join(', ')} and ${last} are supported`
}

const INVALID_GUARD = 'options.guard must be an object or false'
EE('INVALID_GUARD', INVALID_GUARD)

EE('INVALID_PAGE_DEF', 'page definition must be string, array or object')

EE('INVALID_ENTRY', 'entry must be a string')

EE('INVALID_GUARDIAN_PROP', 'guardian.%s must be a function')

EE('INVALID_RENDERER_PROP', 'renderer.%s must be a function')

const INVALID_CACHE = 'options.cache must be an object, undefined or false'
EE('INVALID_CACHE', INVALID_CACHE)

const INVALID_MIDDLEWARE = 'options.middleware must be a function, an array of functions, undefined or false'
EE('INVALID_MIDDLEWARE', INVALID_MIDDLEWARE)

module.exports = {
  error,
  E,
  generateSupportMessage,
  NEXT_NOT_FOUND,
  INVALID_MIDDLEWARE,
  INVALID_GUARD,
  INVALID_CACHE,
  BUT_GOT
}
