const ssr = require('../../../..')

module.exports = ssr({
  pages: {
    '/:lang': 'index.js'
  }
}, {

})
