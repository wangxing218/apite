const path = require('path')
const fs = require('fs')
const util = require('./util')
const { config } = require('./config')
const router = require('./router')


// 兼听文件变化
function watchDir(dir) {
  if (!fs.existsSync(dir)) return
  fs.watch(dir, (event, file) => {
    const filePath = path.resolve(dir, file)
    if (path.extname(filePath).toLowerCase() !== '.js') return
    const handleEvent = () => {
      handleChange(event, filePath)
    }
    delayHandle(handleEvent)
  })
}

// 延时执行
let tick = null
function delayHandle(handle) {
  if (tick) {
    clearTimeout(tick)
    tick = null
    delayHandle(handle)
    return
  }
  tick = setTimeout(() => {
    handle()
  }, config.watchDelay)
}

// 处理文件变化 
function handleChange(event, filePath) {
  router.loadFileRoute(filePath, true)
}

// 兼听
async function handleWatch() {
  if(config.watchDelay <= 0) return
  const appDir = util.appDir()
  if (fs.existsSync(appDir)) {
    watchDir(appDir)
    return
  }
  const err = fs.mkdirSync(appDir)
  if (err) throw err
  watchDir(appDir)
  return
}

module.exports = {
  handleWatch
}



