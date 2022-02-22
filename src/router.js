const path = require('path')
const fs = require('fs')
const util = require('./util')
const { jsFileDoc } = require('./doc')
const { config } = require('./config')
const proxy = require('./proxy')

const routes = []

// 当前正在加载的路由文件
const FILE = {
  path: null,
}

// 添加路由信息
function addRoute({ url, handle, method, options }) {
  if (handle === null || handle === undefined) return
  url = url.trim()
  url = url.indexOf('/') === 0 ? url : '/' + url
  unique(url, method)
  if (options === true || options === 1) {
    options = {
      proxy: true,
    }
  }
  let data = {
    url,
    handle,
    method,
    options,
    doc: {},
  }
  if (FILE.path) {
    data.file = FILE.path
  }
  routes.push(data)
}

// 删除重复路由
function unique(url, method) {
  const key = method + url
  const exited = []
  routes.forEach((item, index) => {
    if (item.method + item.url === key) exited.push(index)
  })
  if (!exited.length) return
  exited.map((index) => routes.splice(index, 1))
}

// 按文件删除路由
function delByFile(file) {
  const cols = []
  routes.forEach((item, index) => {
    if (item.file && item.file === file) {
      cols.push(index)
    }
  })
  cols.reverse().forEach((index) => routes.splice(index, 1))
}

// 不限请求
function all(url, handle, options) {
  addRoute({
    url,
    handle,
    method: '',
    options,
  })
}

// get请求
function get(url, handle, options) {
  addRoute({
    url,
    handle,
    method: 'GET',
    options,
  })
}

// post请求
function post(url, handle, options) {
  addRoute({
    url,
    handle,
    method: 'POST',
    options,
  })
}

// put请求
function put(url, handle, options) {
  addRoute({
    url,
    handle,
    method: 'PUT',
    options,
  })
}

// del请求
function del(url, handle, options) {
  addRoute({
    url,
    handle,
    method: 'DELETE',
    options,
  })
}

// 匹配路由, 只匹配第一条就结束
function match(pathname) {
  let matchRoute = null
  let paramsArr = []
  let params = {}
  routes.every((item) => {
    // 完全相等
    if (item.url === pathname) {
      matchRoute = item
      return false
    }
    // 通配路径
    if (item.url.endsWith('*')) {
      const mUrl = item.url.replace(/\*+$/, '')
      if (pathname.startsWith(mUrl)) {
        matchRoute = item
        return false
      }
    }
    // 带params参数
    if (item.url.indexOf('{') > -1) {
      const reg = new RegExp(
        '^' +
          item.url.replace(/{([^/]+)}/g, (a, key) => {
            paramsArr.push({
              key,
            })
            return '([^/]+)'
          }) +
          '$',
        'g',
      )
      const resArr = reg.exec(pathname)
      if (resArr && resArr.length === paramsArr.length + 1) {
        resArr.forEach((value, index) => {
          if (index < 1) return
          paramsArr[index - 1].value = decodeURIComponent(value)
        })
        matchRoute = item
        return false
      } else {
        paramsArr = []
      }
    }
    return true
  })
  if (paramsArr) {
    paramsArr.map((item) => {
      params[item.key] = item.value
    })
  }
  return { matchRoute, params }
}

// 路由处理
async function handleRoute(ctx) {
  const { matchRoute, params } = match(ctx.path)
  ctx.params = params
  if (!matchRoute || matchRoute.handle === undefined || matchRoute.handle === null) {
    ctx.error()
    return
  }
  if (matchRoute.options && matchRoute.options.proxy) {
    //代理
    const proxyTarget = matchRoute.options.proxy === true ? config.proxy : matchRoute.options.proxy
    if (!proxyTarget) {
      ctx.error(500, 'Please config your proxy url!')
    }
    try {
      const resp = await proxy(ctx, proxyTarget)
      ctx.header = {
        'Data-From': 'proxy',
        ...resp.header,
      }
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
async function scanRoute(dir = util.appDir(), noCache = false) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) reject(err)
      files.forEach((item) => {
        if (item.startsWith('_')) return
        const filePath = path.resolve(dir, item)
        const stats = fs.statSync(filePath)
        if (stats.isDirectory()) {
          scanRoute(filePath)
          return
        }
        loadFileRoute(filePath, noCache)
      })
      resolve()
    })
  })
}

// 加载文件路由
function loadFileRoute(filePath, noCache = false) {
  if (!filePath) return
  if (noCache === true) {
    if (require.cache[filePath]) {
      delete require.cache[filePath]
      delByFile(filePath)
    }
  }
  if (path.extname(filePath) !== '.js') return
  FILE.path = filePath
  try {
    require(filePath)
    jsFileDoc(filePath, routes)
  } catch (err) {
    if (err.code === 'ENOENT') {
      //文件删除
      return
    }
    console.warn(`【js file】:  ${filePath} has error, please check！\n`, err)
  } finally {
    FILE.path = null
    FILE.content = ''
  }
}

module.exports = {
  routes,
  match,
  addRoute,
  all,
  get,
  post,
  put,
  del,
  loadFileRoute,
  scanRoute,
  handleRoute,
  delByFile,
}
