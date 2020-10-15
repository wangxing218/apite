const http = require('http')
const util = require('./util')
const { config, setConfig } = require('./config')
const request = require('./request')
const response = require('./response')
const router = require('./router')
const watch = require('./watch')
const static = require('./static')
const context = require('./context')
const doc = require('./doc')

// 处理请求
async function handle(req, res) {
  const ctx = new context(req, res)
  await request.parseQuery(ctx)
  await request.parsePost(ctx)
  await router.handleRoute(ctx)
  await static.handleStatic(ctx)
  await response.handleBody(ctx)
}

// 启动服务
async function run(options) {
  await init(options)
  const server = http.createServer()
  server.on('request', handle)
  const port = await util.bindPort(config.port, server)
  setConfig({ port })
  util.startLog()
}

// 初始化
async function init(options = {}) {
  setConfig({ ...options })
  await watch.handleWatch()
  await router.scanRoute()
  await doc.docRouter()
  return
}

module.exports = {
  run,
  handle,
  init,
}
