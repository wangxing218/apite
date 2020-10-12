const url = require('url')
const { config } = require('./config')
const qs = require('querystring')

// 序列化get参数
function parseQuery(ctx) {
  const urlParse = url.parse(ctx.req.url)
  let reqPath = urlParse.pathname
  if (config.prefix && reqPath.length >= config.prefix.length) {
    reqPath = reqPath.substr(config.prefix.length)
  }
  const search = urlParse.search
  ctx.query = search ? qs.parse(search.substr(1)) : {}
  ctx.path = reqPath
  ctx.type = config.defaultType
}

// 序例化post参数
async function parsePost(ctx) {
  if (ctx.req.method === 'GET') return
  return new Promise(resolve => {
    const chunks = []
    ctx.req.on('data', chunk => {
      chunks.push(chunk)
    })
    ctx.req.on('end', () => {
      const body = chunks.join('')
      const contentType = ctx.req.headers['Content-Type']
      if (!chunks.length) {
        ctx.post = {}
      } else if (contentType && contentType.toLowerCase().indexOf('application/x-www-form-urlencoded') + 1) {
        ctx.post = qs.parse(decodeURIComponent(body))
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

