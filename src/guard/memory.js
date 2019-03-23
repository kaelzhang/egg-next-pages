module.exports = {
  precheck (app) {

  },

  key (ctx) {
    const {req} = ctx
    return `${req.hostname}${req.path}`
  },

  async onSuccess () {

  }
}
