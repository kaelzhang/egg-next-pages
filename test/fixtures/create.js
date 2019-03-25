const path = require('path')
const {
  Server
} = require('roe-scripts')

const fixture = s => path.resolve(__dirname, s)

const createServer = async name => {
  const server = new Server({
    cwd: fixture(name),
    dev: true
  })

  await server.ready()
  return {
    server,
    app: server.app
  }
}

module.exports = {
  createServer
}
