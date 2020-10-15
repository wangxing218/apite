const path = require('path')
const fs = require('fs')
const util = require('./util')
const { matchDoc, jsFileDoc } = require('./doc')
const { config } = require('./config')
const proxy = require('./proxy')
const { fips } = require('crypto')

exports.routes = []

// 当前正在加载的路由文件
const FILE = {
  path: null,
}

// 添加路由信息
exports.addRoute = function ({ url, handle, method, options }) {
  if (handle === null || handle === undefined) return
  exports.unique(url, method)
  if (options === true || options === 1) {
    options = {
      proxy: true
    }
  }
  let data = {
    url,
    handle,
    method,
    options,
    doc: {}
  }
  if (FILE.path) {
    data.file = FILE.path
  }
  exports.routes.push(data)
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
exports.all = function all(url, handle, options) {
  exports.addRoute({
    url,
    handle,
    method: '',
    options
  })
}

// get请求
exports.get = function (url, handle, options) {
  exports.addRoute({
    url,
    handle,
    method: 'GET',
    options
  })
}

// post请求
exports.post = function (url, handle, options) {
  exports.addRoute({
    url,
    handle,
    method: 'POST',
    options
  })
}

// put请求
exports.put = function (url, handle, options) {
  exports.addRoute({
    url,
    handle,
    method: 'PUT',
    options
  })
}

// put请求
exports.del = function (url, handle, options) {
  exports.addRoute({
    url,
    handle,
    method: 'DELETE',
    options
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
    if (item.url.endsWith('*')) {
      const mUrl = item.url.replace(/\*+$/, '')
      if (pathname.startsWith(mUrl)) {
        matchRoute = item
        return false
      }
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
  if (matchRoute.options && matchRoute.options.proxy) { //代理
    const proxyTarget = matchRoute.options.proxy === true ? config.proxy : matchRoute.options.proxy
    if (!proxyTarget) {
      ctx.err(500, 'Please config your proxy url!')
    }
    try {
      const resp = await proxy(ctx, proxyTarget)
      ctx.header = resp.header
      ctx.status = resp.status
      ctx.body = resp.body
    } catch (err) {
      ctx.error(501, 'Proxy failed!')
    }
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
exports.scanRoute = async function (dir = util.appDir()) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) reject(err)
      files.forEach(item => {
        const filePath = path.resolve(dir, item)
        exports.loadFileRoute(filePath)
      })
      resolve()
    })
  })
}


// 加载文件路由
exports.loadFileRoute = function (filePath, noCache = false) {
  if(noCache === true){
    if (require.cache[filePath]) {
      delete require.cache[filePath]
      exports.delByFile(filePath)
    }
  }
  if (path.extname(filePath) !== '.js') return
  try {
    FILE.path = filePath
    require(filePath)
    jsFileDoc(filePath, exports.routes)
  } catch (err) {
    if (err.code === 'ENOENT') { //文件删除
      return
    }
    console.warn(`【js file】:  ${filePath} has error, please check！\n`, err)
  } finally {
    FILE.path = null
    FILE.content = ''
  }
}