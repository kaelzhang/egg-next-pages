const Cacheman = require('cacheman')
const EngineRedis = require('@ostai/cacheman-redis')

const error = require('../error')

const NOOP = () => {}
const DEFAULT_BOG = {
  debug: NOOP,
  info: NOOP,
  warn: NOOP,
  error: NOOP
}
const DEFAULT_TIMEOUT = 1500
const HEART_BEAT_INTERVAL = 6000
const DEFAULT_GET_CACHE_KEY = req => `${req.hostname}${req.path.toLowerCase()}`

const isLoggedIn = ctx =>
  ctx.cookies.logined === 'y' || ctx.cookies.CSRFToken
const isReallyLoggedIn = html => html.includes('content="-SESSION_VALID-"')

const CACHE_MAX_AGE = 604800
const CACHE_PREFIX = 'coldCache'
const CACHE_LOGGED_IN_PREFIX = 'coldCacheLoggedIn'

const HEADER_SSR_CACHE = 'x-ssr-cache'

class CacheManager {
  constructor (redis) {
    const {
      read,
      write
    } = redis

    this._connected = false

    let counter = 0

    const heartBeat = async () => {
      try {
        write.set('beat', ++ counter)
        this._connected = true
      } catch (err) {
        this._connected = false
      }
    }

    setInterval(heartBeat, HEART_BEAT_INTERVAL)

    const readerConfig = {
      engine: new EngineRedis(read)
    }
    const writerConfig = {
      engine: new EngineRedis(write),
      ttl: CACHE_MAX_AGE
    }

    this._reader = new Cacheman(CACHE_PREFIX, readerConfig)
    this._writer = new Cacheman(CACHE_PREFIX, writerConfig)

    this._loggedInReader = new Cacheman(
      CACHE_LOGGED_IN_PREFIX,
      readerConfig
    )
    this._loggedInWriter = new Cacheman(
      CACHE_LOGGED_IN_PREFIX,
      writerConfig
    )
  }

  get connected () {
    return this._connected
  }

  get reader () {
    return this._reader
  }

  get writer () {
    return this._writer
  }

  get loggedInReader () {
    return this._loggedInReader
  }

  get loggedInWriter () {
    return this._loggedInWriter
  }
}

const factory = (app, {
  pathname,
  cache = {}
}) => {
  const {
    timeout = DEFAULT_TIMEOUT,
    key: generateKey = DEFAULT_GET_CACHE_KEY
  } = cache

  const {
    bog = DEFAULT_BOG,
    redis
  } = app

  if (!redis) {
    throw error('REDIS_PLUGIN_NOT_FOUND')
  }

  const manager = new CacheManager(redis)

  return async (ctx, next) => {
    const {req, res} = ctx
    const key = generateKey(req)

    if (!ctx.cookies) {
      throw error('COOKIE_PARSER_REQUIRED')
    }

    try {
      const start = Date.now()
      const {html} = await next()
      const end = Date.now()
      const duration = end - start

      if (duration > timeout) {
        bog.warn('Slow renderToHTML! Took', `${parseInt(duration, 10)}ms`)
      }

      // NON-200
      // something is wrong with the request, hit cold cache (e.g. 404)
      if (res.statusCode !== 200) {
        // throw an error to hit cold cache
        bog.error(`Render resulted in status ${res.statusCode}`)
        throw error('ERR_STATUS_CODE', res.statusCode)
      }

      if (manager.connected) {
        if (isLoggedIn(req)) {
          if (isReallyLoggedIn(req)) {
            manager.loggedInWriter.set(key, html).catch(bog.error)
          }
        } else {
          manager.writer.set(key, html).catch(bog.error)
        }
      }

      return {
        html
      }
    } catch (err) {
      const cacheError = renderError => {
        bog.error(
          'all cache is missed',
          `key: ${key}`,
        )
        res.setHeader(HEADER_SSR_CACHE, 'MISS-ERR')
        app.renderError(renderError, req, res, pathname, ctx.params)
      }

      // Redis is not connected
      if (!manager.connected) {
        return cacheError(err)
      }

      const logged = isLoggedIn(req)
      const html = logged
        ? await manager.loggedInReader.get(key)
        : await manager.reader.get(key)

      if (html) {
        bog.error(
          'The Normal Render funcationality has been broken, fallback to COLD CACHE',
          `key: ${key}`
        )

        res.setHeader(
          HEADER_SSR_CACHE,
          logged
            ? 'COLD_AUTH'
            : 'COLD'
        )

        return {
          html
        }
      }

      return cacheError(err)
    }
  }
}

module.exports = factory
