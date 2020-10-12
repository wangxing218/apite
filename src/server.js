const http = require('http')
const init = require('./init')
const { config, setConfig } = require('./config')
const util = require('./util')

// 绑定端口
function listen(port, server) {
  this.port = this.port || port
  return new Promise((resolve, reject) => {
    server.listen(this.port, '0.0.0.0')
    server.once('listening', () => {
      resolve(this.port)
    })
    server.once('error', err => {
      if (err.code === 'EADDRINUSE') {
        listen(++this.port, server).then(resolve)
      } else {
        console.log('Start Server error', err.code)
        reject(err)
      }
    })
  })
}

// 运行服务
async function run(options = {}) {
  setConfig(options)
  const server = http.createServer(init.inject)
  const port = await listen(config.port, server)
  setConfig({ port })
  util.startLog()
  return server
}

module.exports = {
  run
}