const { config, setConfig } = require('./config')
const apite = require('./app')
const util = require('./util')

// 默认配置
const defaultOpt = {
  prefix: '/api',
}

// 插件入口
function webpackExt4(options = {}) {
  // 非serve环境
  if (!process.env.WEBPACK_SERVE) return
  apite.init({
    ...defaultOpt,
    ...options,
  })
  return handleApp
}

// 插件执行
function handleApp(server) {
  // app为express实例
  server.app.all(config.prefix + '/*', apite.handle)

  // react项目中如果使用 /src/setupProxy.js，则不存在sever参数
  if (!server) return
  let done = false
  server.compiler.hooks.done.tap('apite-server-start', () => {
    if (done) return
    done = true
    const port = server.options.port || 8080
    setConfig({
      port,
    })
    setTimeout(() => util.startLog(), 300)
  })
}

module.exports = webpackExt4
