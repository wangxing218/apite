const router = require('./src/router')
const resp = require('./src/resp')
const Mock = require('./lib/mock')

const util = require('./src/util')
const webpackExt = require('./src/webpack-ext')
const webpackExt4 = require('./src/webpack-ext4')
const viteExt = require('./src/vite-ext')
const vite2Ext = require('./src/vite2-ext')

exports.api = {
  get: router.get,
  post: router.post,
  put: router.put,
  del: router.del,
  all: router.all,
}
exports.delay = util.delay
exports.webpackExt = webpackExt
exports.webpackExt4 = webpackExt4
exports.viteExt = viteExt
exports.vite2Ext = vite2Ext
exports.mock = Mock.mock
exports.resp = resp
