const {parse} = require('url')
const {error} = require('../error')

module.exports = {
  precheck ({
    next
  }) {
    if (!next) {
      throw error('NEXT_NOT_FOUND')
    }

    return {
      next
    }
  },

  async render (ctx, pagePath) {
    const {
      req,
      res,
      params,
      next
    } = ctx

    const {
      query
    } = parse(ctx.url, true)

    return next.renderToHTML(req, res, pagePath, {
      ...query,
      ...params
    })
  }
}
