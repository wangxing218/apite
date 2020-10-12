const path = require('path')
const fs = require('fs')
const util = require('./util')
const { config } = require('./config')

exports.routes = []

exports.FILE = null

// 添加路由信息
exports.addRoute = function({ url, handle, method }) {
  if (handle === null || handle === undefined) return
  exports.unique(url, method)
  exports.routes.push({
    url,
    handle,
    method,
    file: exports.FILE ? exports.FILE : undefined,
  })
}

// 删除重复路由
exports.unique = function (url, method) {
  const key = method + url
  const exited = []
  exports.routes.forEach((item, index) => {
    if (item.method + item.url === key)
      exited.push(index)
  })
  if (!exited.length) return
  exited.map(index => exports.routes.splice(index, 1))
}

// 按文件删除路由
exports.delByFile = function (file) {
  const cols = []
  exports.routes.forEach((item, index) => {
    if (item.file && item.file === file) {
      cols.push(index)
    }
  })
  cols.reverse().forEach(index => exports.routes.splice(index, 1))
}

// 不限请求
exports.all = function all(url, handle) {
  exports.addRoute({
    url,
    handle,
    method: ''
  })
}

// get请求
exports.get = function (url, handle) {
  exports.addRoute({
    url,
    handle,
    method: 'GET'
  })
}

// post请求
exports.post = function (url, handle) {
  exports.addRoute({
    url,
    handle,
    method: 'POST'
  })
}

// 匹配路由, 只匹配第一条就结束
exports.match = function (pathname) {
  let matchRoute = null
  exports.routes.every(item => {
    if (item.url === pathname) {
      matchRoute = item
      return false
    }
    return true
  })
  return matchRoute
}

// 路由处理
 exports.handleRoute = async function (ctx) {
  const matchRoute = exports.match(ctx.path)
  if (!matchRoute || matchRoute.handle === undefined || matchRoute.handle === null) {
    ctx.error()
    return
  }
  if (config.strictMethod && matchRoute.method && matchRoute.method !== ctx.method) {
    ctx.error(506, 'Request method not supported!')
  } else if (typeof matchRoute.handle === 'function') {
    const res = await matchRoute.handle(ctx)
    if (res && !ctx.body) ctx.body = res
  } else {
    ctx.body = matchRoute.handle
  }
}

// 第一次启动时加载路由文件
exports.scanRoute = function (dir = util.appDir()) {
  fs.readdir(dir, (err, files) => {
    if (err) throw err
    files.forEach(item => {
      const filePath = path.resolve(dir, item)
      exports.loadFileRoute(filePath)
    })
  })
}


// 加载文件路由
exports.loadFileRoute = function(filePath){
  if(path.extname(filePath) !== '.js') return
  try {
    exports.FILE = filePath
    require(filePath)
  } catch (err) {
    if (err.code === 'ENOENT') { //文件删除
      return
    }
    console.warn(`【js file】:  ${filePath} has error, please check！\n`, err)
  } finally {
    exports.FILE = null
  }
}