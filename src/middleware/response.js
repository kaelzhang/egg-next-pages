const HEADER_KEY_CACHE_CONTROL = 'cache-control'
const NO_CACHE = 'no-cache, no-store, must-revalidate'
const WITH_CACHE = age => `max-age=${age}, must-revalidate`

const ZERO = 0

module.exports = (cache = {}) => async (ctx, next) => {
  const html = await next()

  ctx.set(
    HEADER_KEY_CACHE_CONTROL,

    // https://stackoverflow.com/questions/1046966/whats-the-difference-between-cache-control-max-age-0-and-no-cache
    cache === false
      ? NO_CACHE
      : WITH_CACHE(parseInt((cache.maxAge || ZERO) / 1000, 10))
  )

  if (html) {
    ctx.body = html
  }
}
