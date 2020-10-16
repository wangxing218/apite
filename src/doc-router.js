const { config } = require('./config')
const router = require('./router')
const { webDir, appDir } = require('./util')
const { FileDoc } = require('./doc')

// 挂载路由展示前端页面
async function docRouter() {
  // 为空时不添加路由
  if (typeof config.doc !== 'string' || !config.doc) return
  // 首页
  router.get(config.doc, ctx => {
    ctx.file = webDir('index.html')
  })
  // 静态目录
  router.get('/_doc_static/*', ctx => {
    ctx.file = webDir('_doc_static', ctx.path.substr(13))
  })
  // api
  router.get('/_doc_api/data', ctx => {
    const appPath = appDir()
    const files = FileDoc.sort((a, b) => { return a.sort - b.sort }).concat([])
    files.forEach(item => {
      item.file = item.file.indexOf(appPath) === 0 ? item.file.substr(appPath.length) : item.file
    })
    const routes = [...router.routes].map(item => {
      item.file = item.file && item.file.indexOf(appPath) === 0 ? item.file.substr(appPath.length) : item.file
      return item
    })
    ctx.json({
      code: 0,
      msg: 'ok',
      result: {
        info: {
          title: config.docTitle,
          desc: config.docDesc,
          prefix: config.prefix,
        },
        files,
        routes,
      }
    })
  })
}

module.exports = {
  docRouter
}
