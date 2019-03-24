module.exports = ({
  key: createKey,
  validateSSRResult,
  onSuccess,
  fallback
}) => (ctx, next) => {
  const key = createKey(ctx)
  const start = Date.now()
  return next()
  .then(
    html =>
      validateSSRResult(ctx, key, html, Date.now() - start)
      .then(valid => {
        if (valid === false) {
          return Promise.reject(error('GUARDIAN_VALIDATE_FAILS'))
        }

        return onSuccess(ctx, key, html)
      })
  )
  .catch(error => fallback(ctx, key, error))
}
