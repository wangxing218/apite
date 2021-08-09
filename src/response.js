const path = require('path')
const fs = require('fs')
const mime = require('../lib/mime')
const Mock = require('../lib/mock')
const { config } = require('./config')
const { isObj, appDir } = require('./util')
const cookie = require('./cookie')

// 处理输出
async function handleBody(ctx) {
  await respBody(ctx)
  await respHeaders(ctx)
  ctx.file = null
  ctx.res.writeHead(ctx.status, ctx.header)
  ctx.res.end(ctx.body)
}

// 响应体
async function respBody(ctx) {
  if (ctx.file) {
    try {
      ctx.status = 200
      ctx.body = await getFileData(ctx.file)
    } catch (e) {
      ctx.error()
    }
  }
  if (typeof ctx.body === 'string') return
  if (ctx.body instanceof Buffer) return
  else if (ctx.type === 'json' || ctx.type === 'jsonp' || isObj(ctx.body)) {
    ctx.type = ctx.type || 'json'
    const callback = ctx.query.callback || 'callback'
    if (config.mock) {
      Mock.mock(ctx.body)
    }
    try {
      let res = JSON.stringify(ctx.body || {}, null, config.jsonFormat ? '  ' : null)
      ctx.body = ctx.type === 'jsonp' ? `${callback}(${res})` : res
    } catch (error) {
      console.log(error)
      ctx.error(500, 'Router handle has error!')
    }
    return
  }
}

function isIE(ctx) {
  const agent = ctx.req.headers['user-agent']
  return agent.indexOf('MSIE') > 0 || agent.indexOf('rv:11') > 0
}

// 响应头
async function respHeaders(ctx) {
  let contentType = mime.contentType(ctx.type)
  cookie.respCookie(ctx)
  if (ctx.file) {
    contentType = ctx.status === 404 ? null : mime.contentType(path.extname(ctx.file))
  } else if (!ctx.type && isObj(ctx.body)) {
    ctx.type = 'json'
    contentType = mime.contentType('json')
  } else if (ctx.type === 'jsonp') {
    contentType = mime.contentType('js')
  }
  if (ctx.type === 'json' && isIE(ctx)) {
    contentType = mime.contentType('txt')
  }
  contentType = contentType || mime.contentType('txt')
  ctx.header = {
    'Content-Type': contentType,
    'Data-From': 'apite',
    ...ctx.header,
  }
  if (!ctx.header['Access-Control-Allow-Origin'] && config.crossDomain) {
    ctx.header['Access-Control-Allow-Origin'] = config.crossDomain
  }
}

// 发送文件
function getFileData(file) {
  return new Promise((resolve, reject) => {
    const relFile = path.isAbsolute(file) ? file : appDir(file)
    const read = fs.createReadStream(relFile)
    const chunks = []
    read.on('data', (data) => chunks.push(data))
    read.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    read.on('error', reject)
  })
}

module.exports = {
  handleBody,
  getFileData,
}
