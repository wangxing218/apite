const router = require('./src/router')
const resp = require('./src/resp')
const Mock = require('./lib/mock')

const util = require('./src/util')
const webpackExt = require('./src/webpack-ext')
const viteExt = require('./src/vite-ext')


exports.api = {
  get: router.get,
  post: router.post,
  put: router.put,
  del: router.del,
  all: router.all,
}
exports.delay = util.delay
exports.webpackExt = webpackExt
exports.viteExt = viteExt
exports.mock = Mock.mock
exports.resp = resp
