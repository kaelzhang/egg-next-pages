/* eslint-disable import/no-unresolved */
const ssr = require('egg-ssr-pages')

const normal = () => ssr({
  '/home/:lang': 'index'
}, {

})

const memory = () => ssr({
  '/home/:lang': 'index',
  '/not-exists': 'not-exists'
}, {
  guard: ssr.memoryGuardian({
    max: 1
  })
})

const TYPES = {
  normal,
  memory
}

const type = process.env.EGG_SSR_PAGES_TYPE

module.exports = TYPES[type]()
