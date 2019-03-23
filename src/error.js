const {Errors} = require('err-object')

const {error, E} = new Errors()

E('REDIS_PLUGIN_NOT_FOUND',
  '"egg-redis" plugin is required if page cache is on')

E('COOKIE_PARSER_REQUIRED',
  'cookieParser middleware is required')

E('ERR_STATUS_CODE', 'Error %s')

E('INVALID_STATIC_ROOT', {
  message: 'static root must be a string, but got %s',
  ctor: TypeError
})

E('NEXT_NOT_FOUND', 'app.next not found, please use @binance/scripts to start server, or you need to add next instance to egg app before router is about to load')

module.exports = error
