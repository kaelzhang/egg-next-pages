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

  return Promise.resolve(next())
  .then(
    html => {
      const result = validateSSRResult(context, key, html, Date.now() - start)

      // validateSSRResult could be a non-async function
      return Promise.resolve(result)
      .then(valid => {
        if (valid === false) {
          return fallback(context, key, html, null)
        }

        return onSuccess(context, key, html)
      })
      .then(() => html)
    },
    err => fallback(context, key, undefined, err)
  )
}
