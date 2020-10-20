const path = require('path')
const { config } = require('./config')

// 项目根目录
exports.cwd = function (...dir) {
  return path.resolve(process.cwd(), ...dir)
}

// apite接口所在目录
exports.appDir = function (...dir) {
  if (path.isAbsolute(config.dir)) return config.dir
  return exports.cwd(config.dir, ...dir)
}

// apite模块所在目录
exports.moduleDir = function (...dir) {
  return path.resolve(__dirname, '../', ...dir)
}

// apite doc web所在目录
exports.webDir = function (...dir) {
  return path.resolve(__dirname, '../web', ...dir)
}


// isObj
exports.isObj = function (obj) {
  return obj !== null && typeof obj === 'object'
}

// 延时
exports.delay = function (from, to) {
  if (!from) return
  return new Promise(resolve => {
    const timeDelay = to && to > from ? random(from, to) : from
    setTimeout(resolve, timeDelay)
  })
}

// 生成随机数
exports.random = function (from = 1, to = 10) {
  return from + parseInt(Math.random() * (to - from + 1))
}

// 输出提示
exports.startLog = function () {
  const docPath = config.doc && config.doc.startsWith('/') ? config.doc : '/' + (config.doc || '/')
  console.log(`
  Apite server running at: 
  > Doc:      \x1B[32mhttp://localhost:${config.port}${config.prefix}${docPath}\x1B[39m`)
}

// 判断对象是否为JSON
exports.isJSON = function (obj) {
  return obj && typeof obj !== 'string' && obj.toString && obj.toString() === '[object Object]'
}

// 格式化命令行参数，如 apite --port=9000 
exports.parseCMD = function (target = {}) {
  const args = process.argv.slice(2)
  const res = {}
  args.map(item => {
    if (!item.startsWith('--')) return
    const regArr = item.match(/\-\-(\w+)(\=(.*))?/i)
    if (!regArr || regArr.length !== 4) return
    let val = regArr[3]
    const key = regArr[1]
    const type = typeof target[key]
    if (val === undefined) {
      if (type === 'boolean') val = true
      else if (type === 'number') val = 0
      else val = ''
    } else {
      if (type === 'number') val = Number(val)
      if (type === 'boolean') val = (val == '0' || val == 'false') ? false : true
    }
    res[key] = val
  })
  
  return res
}

// 绑定端口
exports.bindPort =function(port, server) {
  this.port = this.port || port
  return new Promise((resolve, reject) => {
    server.listen(this.port, '0.0.0.0')
    server.once('listening', () => {
      resolve(this.port)
    })
    server.once('error', err => {
      if (err.code === 'EADDRINUSE') {
        this.bindPort(++this.port, server).then(resolve)
      } else {
        console.log('Start Server error', err.code)
        reject(err)
      }
    })
  })
}
