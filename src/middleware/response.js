const HEADER_KEY_CACHE_CONTROL = 'cache-control'
const NO_CACHE = 'no-cache, no-store, must-revalidate'
const WITH_CACHE = age => `max-age=${age}, must-revalidate`

const DEFAULT_CDN_MAX_AGE = 60000

const factory = ({
  CDN = {}
}) => async (ctx, next) => {
  const html = await next()

  ctx.set(
    HEADER_KEY_CACHE_CONTROL,
    CDN === false
      ? NO_CACHE
      : WITH_CACHE(parseInt((CDN.maxAge || DEFAULT_CDN_MAX_AGE) / 1000, 10))
  )

  // Next will not set ctx.status explicitly
  // So set status to prevent koa 404 error
  ctx.status = status || ctx.res.statusCode || 200

  if (html) {
    ctx.body = html
  }
}

module.exports = factory
