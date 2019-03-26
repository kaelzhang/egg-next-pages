const {
  HEADERS,
  SET_HEADER,
  STATUS_EXPLICIT_SET
} = require('../response')

const HEADER_KEY_CACHE_CONTROL = 'cache-control'
const NO_CACHE = 'no-cache, no-store, must-revalidate'
const WITH_CACHE = age => `max-age=${age}, must-revalidate`

const ZERO = 0

module.exports = cache => async (ctx, next) => {
  const html = await next()

  ctx.set(
    HEADER_KEY_CACHE_CONTROL,

    // https://stackoverflow.com/questions/1046966/whats-the-difference-between-cache-control-max-age-0-and-no-cache
    cache === false
      ? NO_CACHE
      : WITH_CACHE(parseInt((cache.maxAge || ZERO) / 1000, 10))
  )

  const {
    res
  } = ctx

  // If res.statusCode have been set by some middleware,
  // then apply the code to ctx
  if (res[STATUS_EXPLICIT_SET]) {
    ctx.status = res.statusCode
  }

  ctx.body = html

  res.setHeader = res[SET_HEADER]
  const headers = res[HEADERS]

  Object.keys(headers).forEach(key => {
    res.setHeader(key, headers[key])
  })

  delete res[SET_HEADER]
  delete res[HEADERS]
}
