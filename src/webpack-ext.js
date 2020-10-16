
const { config, setConfig } = require('./config')
const apite = require('./app')
const util = require('./util')

// 默认配置
const defaultOpt = {
  prefix: '/api'
}

// 插件入口
function webpackExt(options = {}) {
  apite.init({
    ...defaultOpt,
    ...options
  })
  return handleApp
}

// 插件执行
function handleApp(app, server, compiler) {
  let done = false
  compiler.hooks.done.tap('apite-server-start', () => {
    if(done) return
    done = true
    const port = server.options.port
    setConfig({
      port,
    })
    util.startLog()
  })
  app.all(config.prefix + '/*', apite.handle)
}

module.exports = webpackExt