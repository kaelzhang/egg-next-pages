const LRU = require('lru-cache')

const HEADER_SSR = 'X-SSR-GUARD'
const NO_GUARD = 'no'
const GUARD = 'yes'

const createKey = ctx => `${ctx.hostname}${ctx.url}`

const onSuccess = (ctx, key, html, cache) => {
  ctx.res.setHeader(HEADER_SSR, NO_GUARD)
  cache.set(key, html)
}

const validateSSRResult = ctx => {
  const {res} = ctx
  return res.statusCode === 200
}

const fallback = (ctx, key, html, error, cache) => {
  const value = cache.get(key)
  if (value) {
    const {
      res
    } = ctx

    res.statusCode = 200
    res.setHeader(HEADER_SSR, GUARD)
    return value
  }

  if (error) {
    throw error
  }
}

module.exports = options => {
  const cache = new LRU(options)
  return {
    key: createKey,
    onSuccess: (...args) => onSuccess(...args, cache),
    validateSSRResult,
    fallback: (...args) => fallback(...args, cache)
  }
}
