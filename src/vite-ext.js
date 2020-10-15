
const { config, setConfig } = require('./config')
const apite = require('./app')
const util = require('./util')

const defaultOpt = {
  prefix: '/api'
}

function viteExt(options = {}) {
  apite.init({
    ...defaultOpt,
    ...options
  })
  return handleApp
}

function handleApp({
  root, // project root directory, absolute path
  app, // Koa app instance
  server, // raw http server instance
  watcher,
  port, // chokidar file watcher instance
}) {
  app.listen(() => {
    setConfig({
      port,
    })
    util.startLog()
  })

  app.use(async (ctx, next) => {
    if (!ctx.path.startsWith(config.prefix)) {
      await next()
      return
    }
    await apite.handle(ctx.req, ctx.res)
    await next()
  })

}

module.exports = viteExt