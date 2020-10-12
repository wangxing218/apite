
const { config, setConfig } = require('./config')
const init = require('./init')
const util = require('./util')

const defaultOpt = {
  prefix: '/api'
}

function webpackExt(options = {}) {
  setConfig({
    ...defaultOpt,
    ...options
  })
  return handleApp
}

function handleApp(app, server) {
  app.listen(() => {
    setConfig({
      port: server.options.port
    })
    util.startLog()
  })
  app.all(config.prefix + '/*', init.inject)
}

module.exports = webpackExt