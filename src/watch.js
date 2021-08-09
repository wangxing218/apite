const path = require('path')
const fs = require('fs')
const util = require('./util')
const watch = require('../lib/watch')
const { config } = require('./config')
const router = require('./router')
const { delFileDoc } = require('./doc')

/**
 * 兼听文件变化
 * @param {string} 兼听的目录
 * @param {number} 目录嵌套深度，目前支持2级嵌套
 * @returns
 */
function watchDir(dir) {
  if (!fs.existsSync(dir)) return
  watch(
    dir,
    {
      recursive: true,
      filter: (file, skip) => {
        const ext = path.extname(file).toLowerCase()
        if (ext === '' || ext === '.js') return true
        return skip
      },
    },
    (event, file) => {
      if (path.basename(file).startsWith('_')) return
      const ext = path.extname(file).toLowerCase()
      const isFile = ext === '.js'
      delFileDoc(file) // 删除内存中的文件注释
      if (!isFile && event === 'update') {
        // 文件夹有变动
        router.scanRoute(file, true)
        return
      }
      delayHandle(() => {
        handleChange(event, file)
      })
    },
  )
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
  if (config.watchDelay <= 0) return
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
  handleWatch,
}
