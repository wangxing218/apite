
const { config, setConfig } = require('./config')
const apite = require('./app')
const util = require('./util')

// 默认配置
const defaultOpt = {
  prefix: '/api'
}

// 插件入口
function vite2Ext(options = {}) {
  apite.init({
    ...defaultOpt,
    ...options
  })
  return {
    name: 'vite-plugin-apite',
    configResolved(resolvedConfig) {
      isBuild = resolvedConfig.command == 'build'
    },
    configureServer(server) {
      const initOptions = {
        ...defaultOpt,
        ...options,
      }
      if (isBuild) {
        initOptions.watchDelay = 0
      }
      apite.init(initOptions)
      handleApp(server)
    }
  }
}

function handleApp(server) {
  server.httpServer.on('listening', () => {
    const port = server.httpServer.address().port
    setConfig({
      port,
    })
    util.startLog()
  })
  server.middlewares.use((req, res, next) => {
    if (!req.url.startsWith(config.prefix)) {
      next()
      return
    }
    apite.handle(req, res)
  })

}

module.exports = vite2Ext