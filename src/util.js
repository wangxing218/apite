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
  console.log(`
Apite Server is running at \n
  \x1B[32mhttp://localhost:${config.port}${config.prefix}/\x1B[39m
  `)
}

// 判断对象是否为JSON
exports.isJSON = function (obj) {
  return obj && typeof obj !== 'string' && obj.toString && obj.toString() === '[object Object]'
}

// 格式化命令行参数
exports.parseCMD = function(){
  const args = process.argv.slice(2)
  const res = {}
  args.map(item=>{
    if(!item.startsWith('--')) return
    const regArr = item.match(/\-\-(\w+)(\=(\w+))?/i)
    if(!regArr || regArr.length !== 4) return
    res[regArr[1]] = regArr[3] === undefined ? true : regArr[3]
  })
  res.port = res.port ? parseInt(res.port) : config.port
  res.watchDelay = res.watchDelay ? parseInt(res.watchDelay) : config.watchDelay
  return res
}