const {
  createContext
} = require('../options')

const wrapAsync = async fn => fn()

module.exports = ({
  key: createKey,
  validateSSRResult,
  onSuccess,
  fallback: fallbackTo
}, contextExtends) => (ctx, next) => {
  let html

  const context = createContext(ctx, contextExtends)
  const key = createKey(context)
  const start = Date.now()
  const fallback = err => fallbackTo(context, key, html, err)


  return Promise.resolve(wrapAsync(next))
  .then(rendered => {
    html = rendered
    // validateSSRResult could be an non-async function
    return validateSSRResult(context, key, html, Date.now() - start)
  })
  .then(
    async valid => {
      // There is no error, just invalid
      if (valid === false) {
        return fallback(null)
      }

      try {
        await onSuccess(context, key, html)
      } catch (err) {
        return fallback(err)
      }

      // Real output, it will goes into response
      return html
    },
    // error thrown from
    // - next() <- not next.js
    // - validateSSRResult
    // Other fallbacks should not goes into fallback again
    fallback
  )
}
