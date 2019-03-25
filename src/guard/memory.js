const LRU = require('lru-cache')

const createKey = ctx => {
  const {req} = ctx
  return `${req.hostname}${req.path}`
}

const onSuccess = (ctx, key, html, cache) => {
  cache.set(key, html)
}

const validateSSRResult = ctx => {
  const {res} = ctx
  return res.statusCode === 200
}

const fallback = (ctx, key, error, cache) => {
  const value = cache.get(key)
  if (value) {
    return value
  }

  throw error
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
