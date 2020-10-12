const request = require('./request')
const response = require('./response')
const router = require('./router')
const watch = require('./watch')
const static = require('./static')
const context = require('./context')

  ; (async function () {
    await watch.handleWatch()
    await router.scanRoute()
  }())

async function inject(req, res) {
  const ctx = new context(req, res)
  await request.parseQuery(ctx)
  await request.parsePost(ctx)
  await router.handleRoute(ctx)
  await router.handleRoute(ctx)
  await static.handleStatic(ctx)
  await response.handleBody(ctx)
}


module.exports = {
  inject,
}