const url = require('url')
const { config } = require('./config')
const qs = require('querystring')

// 序列化get参数
function parseQuery(ctx) {
  ctx.url = ctx.req.url
  const urlParse = url.parse(ctx.url)
  let reqPath = urlParse.pathname
  if (config.prefix && reqPath.length >= config.prefix.length) {
    reqPath = reqPath.substr(config.prefix.length)
  }
  const search = urlParse.search
  ctx.query = search ? qs.parse(search.substr(1)) : {}
  ctx.path = reqPath
  ctx.url = ctx.url.substr(config.prefix.length)
  ctx.type = config.defaultType
}

// 序例化post参数
async function parsePost(ctx) {
  if (ctx.req.method === 'GET') return
  return new Promise((resolve) => {
    const chunks = []
    ctx.req.on('data', (chunk) => {
      chunks.push(chunk)
    })
    ctx.req.on('end', () => {
      const body = Buffer.concat(chunks)
      ctx.req.rawBody = body
      const contentType = (ctx.req.headers['content-type'] || '').toLowerCase()
      if (!chunks.length) {
        ctx.post = {}
      } else if (contentType.indexOf('application/x-www-form-urlencoded') == 0) {
        ctx.post = qs.parse(decodeURIComponent(body))
      } else if (contentType.indexOf('multipart/form-data') == 0) {
        ctx.post = body
      } else {
        try {
          ctx.post = JSON.parse(body)
        } catch (e) {
          ctx.post = body
        }
      }
      resolve(ctx.post)
    })
  })
}

module.exports = {
  parseQuery,
  parsePost,
}
