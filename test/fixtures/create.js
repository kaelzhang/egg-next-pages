const path = require('path')
const {
  Server
} = require('roe-scripts')
// const npminstall = require('npminstall')
// const co = require('co')

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

// const install = root => new Promise((resolve, reject) => {
//   const command = spawn('npm', ['install'], {
//     cwd: root,
//     stdio: 'inherit'
//   })

//   command.on('close', code => {
//     if (code === 0) {
//       resolve()
//       return
//     }

//     reject(new Error('npm install failed'))
//   })
// })

// const install = root => co(function* wrap () {
//   yield npminstall({
//     root
//   })
// })

module.exports = {
  createServer,
  fixture,
  // install
}
