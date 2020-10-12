const path = require('path')
const fs = require('fs')
const mime = require('../lib/mime')
const { config } = require('./config')
const { isJSON, appDir } = require('./util')

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
  else if (ctx.type === 'json' || ctx.type === 'jsonp' || isJSON(ctx.body)) {
    const callback = ctx.query.callback || 'callback'
    if (config.mock) {
      ctx.mock(ctx.body)
    }
    let res = JSON.stringify(ctx.body || {}, null, config.jsonFormat ? '  ' : null)
    ctx.body = ctx.type === 'jsonp' ? `${callback}(${res})` : res
    return
  }
}


// 响应头
async function respHeaders(ctx) {
  let contentType = mime.contentType(ctx.type)
  if (ctx.file) {
    contentType = ctx.status === 404 ? null : mime.contentType(path.extname(ctx.file))
  } else if (!ctx.type && isJSON(ctx.body)) {
    contentType = mime.contentType('json')
  } else if (ctx.type === 'jsonp') {
    contentType = mime.contentType('js')
  }
  contentType = contentType || mime.contentType('txt')
  ctx.header = {
    'Content-type': contentType,
    'Date-From': 'apite',
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
    fs.readFile(relFile, { encoding: 'utf-8' }, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}


module.exports = {
  handleBody
}
