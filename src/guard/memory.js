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
  console.log('validate', ctx.url, res.statusCode)
  return res.statusCode === 200
}

const fallback = (ctx, key, html, error, cache) => {
  const value = cache.get(key)
  console.log('++++++++++ fallback', key, ctx.url, !!value)
  if (value) {
    ctx.res.setHeader(HEADER_SSR, GUARD)
    return value
  }

  if (error) {
    throw error
  }

  console.log('return undefined', key)
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
