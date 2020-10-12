const router = require('./src/router')
const Mock = require('./lib/mock')

const util = require('./src/util')
const webpackExt = require('./src/webpack-ext')


exports.api = {
  get: router.get,
  post: router.post,
  all: router.all,
}
exports.delay = util.delay
exports.webpackExt = webpackExt
exports.mock = Mock.mock
