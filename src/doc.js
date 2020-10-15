const fs = require('fs')
const path = require('path')
const { config } = require('./config')
const router = require('./router')
const docTool = require('./doc-tool')
const { webDir } = require('./util')


// 文件注释数据 
const FileDoc = []

// 解析文件成jsdoc
async function jsFileDoc(filePath, routes) {
  if (!config.doc) return
  delFileDoc(filePath)
  const fileRoutes = routes.filter(item => item.file && item.file === filePath)
  if (!fileRoutes.length) return
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, { encoding: 'utf8' }, (err, data) => {
      if (err) reject(err)
      const content = (data + '').trim()
      if (!content) resolve()
      matchDoc(content, routes, filePath)
      resolve()
    })
  })
}

// 删除文件的说明数据 
function delFileDoc(filePath) {
  const idx = []
  FileDoc.map((item, index) => {
    if (item.file && item.file === filePath) {
      idx.push(index)
    }
  })
  idx.reverse().map(index => {
    FileDoc.splice(index, 1)
  })
}

// 格式化文档
function matchDoc(content = '', routes, filePath) {
  // 文件注释
  renderFileDoc(content, filePath)
  // 路由注释
  routes.forEach(router => {
    if (router.file !== filePath) return
    let res = {}
    const method = {
      'GET': 'get',
      'POST': 'post',
      'PUT': 'put',
      'DELETE': 'del',
    }[router.method] || 'all'

    // 单行注释只匹配标题
    const singleReg = new RegExp(`\\/\\/\\s*(.*?)[\\r\\n]+\\s*api\\.${method}\\(\\s*['"]${router.url}`)
    const singleRes = content.match(singleReg)

    if (singleRes && singleRes[1]) {
      res.name = singleRes[1]
      router.doc = res
      return
    }

    // 多行注释分步解析
    const multiReg = new RegExp(`\\/\\*+[\\r\\n]+(\\s*\\*(.*?)[\\r\\n]*)*[\\r\\n\\s]+\\s*api\\.${method}\\(\\s*['"]${router.url}`)
    const multiRes = content.match(multiReg)
    if (multiRes && multiRes[0]) {
      router.doc = docTool.parseDoc(multiRes[0]) || {}
    }
  })
}

// 文件头部注释
function renderFileDoc(content, filePath) {
  const arr = content.split(/require\s*\(\s*['"]apite['"]/)
  if (!arr.length) return
  const docReg = arr[0].match(/\/\*+([\s\S]+?)\*\//i)
  let res = {
    name: path.basename(filePath, path.extname(filePath)),
    file: filePath
  }
  if (docReg) {
    const docInfo = docTool.parseDoc(docReg[0])
    res.name = docInfo.name || res.name
    res = {
      ...docInfo,
      ...res
    }
  }
  FileDoc.push(res)
}

// 挂载路由展示前端页面
async function docRouter() {
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
    ctx.json({
      code: 0,
      msg: 'ok',
      result: {
        info: {
          title: config.docTitle,
          desc: config.docDesc,
          prefix: config.prefix,
        },
        files: FileDoc.sort((a, b) => { return a.sort - b.sort }),
        routes: router.routes
      }
    })
  })
}

module.exports = {
  jsFileDoc,
  matchDoc,
  docRouter,
}