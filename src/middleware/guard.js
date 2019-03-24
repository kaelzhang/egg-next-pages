const {
  createContext
} = require('../options')

module.exports = ({
  key: createKey,
  validateSSRResult,
  onSuccess,
  fallback
}, contextExtends) => (ctx, next) => {
  const context = createContext(ctx, contextExtends)
  const key = createKey(context)
  const start = Date.now()
  return next()
  .then(
    html =>
      validateSSRResult(context, key, html, Date.now() - start)
      .then(valid => {
        if (valid === false) {
          return Promise.reject(error('GUARDIAN_VALIDATE_FAILS'))
        }

        return onSuccess(context, key, html)
      })
  )
  .catch(error => fallback(context, key, error))
}
