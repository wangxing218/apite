
const { config, setConfig } = require('./config')
const apite = require('./app')
const util = require('./util')

const defaultOpt = {
  prefix: '/api'
}

function webpackExt(options = {}) {
  apite.init({
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
  app.all(config.prefix + '/*', apite.handle)
}

module.exports = webpackExt