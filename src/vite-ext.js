
const { config, setConfig } = require('./config')
const init = require('./init')
const util = require('./util')

const defaultOpt = {
  prefix: '/api'
}

function viteExt(options = {}) {
  setConfig({
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
    await init.inject(ctx.req, ctx.res)
    await next()
  })

}

module.exports = viteExt