const { config } = require('./config')
const router = require('./router')
const { webDir, appDir, cwd } = require('./util')
const { FileDoc } = require('./doc')
const { getFileData } = require('./response')

// 挂载路由展示前端页面
async function docRouter() {
  // 为空时不添加路由
  if (typeof config.doc !== 'string' || !config.doc) return
  // 首页
  router.get(config.doc, ctx => {
    ctx.file = webDir('index.html')
  })
  // 静态目录
  router.get('/_doc_static/_doc_static/*', ctx => {
    ctx.file = webDir('_doc_static', ctx.path.substr(25))
  })
  // 静态目录
  router.get('/_doc_static/*', ctx => {
    ctx.file = webDir('_doc_static', ctx.path.substr(13))
  })
  // api
  router.get('/_doc_api/data', async ctx => {
    const appPath = appDir()
    // 文件
    const files = JSON.parse(JSON.stringify(FileDoc)).sort((a, b) => { return a.sort - b.sort })
    files.forEach(item => {
      item.file = item.file.indexOf(appPath) === 0 ? item.file.substr(appPath.length) : item.file
    })
    // 路由
    const routes = JSON.parse(JSON.stringify(router.routes)).map(item => {
      item.file = item.file && item.file.indexOf(appPath) === 0 ? item.file.substr(appPath.length) : item.file
      return item
    })
    // 说明文档
    let desc = config.docDesc
    if (desc && desc.trim().endsWith('.md')) {
      try {
        const fileData = await getFileData(cwd(desc)) + ''
        desc = fileData || desc
      } catch (error) {
        desc = config.docDesc
      }
    }
    ctx.json({
      code: 0,
      msg: 'ok',
      result: {
        info: {
          version: require('../package.json').version,
          desc,
          title: config.docTitle,
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
