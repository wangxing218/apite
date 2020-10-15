// 请求代理
const http = require('http')
const https = require('https')
const url = require('url')
const { config } = require('./config')
const { isObj } = require('./util')


async function proxy(ctx, proxy) {
  proxy = proxy || config.proxy
  const proUrl = isObj(proxy) ? proxy.target : proxy
  const parsedUrl = url.parse(proUrl)
  const rewrite = proxy ? proxy.rewrite : false
  const handle = parsedUrl.protocol === 'https:' ? https : http
  const origin = parsedUrl.protocol + '//' + parsedUrl.host

  let reqUrl = typeof rewrite === 'string' ? ctx.url.replace(rewrite, '') : ctx.url
  if (isObj(rewrite)) {
    Object.keys(rewrite).map(key => {
      reqUrl = reqUrl.replace(key, rewrite[key])
    })
  }
  const reqPath = parsedUrl.pathname + reqUrl
  const reqHeaders = formatHeaders(ctx.req.rawHeaders)
  return new Promise((resolve, reject) => {
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: reqPath,
      method: ctx.method,
      headers: {
        ...reqHeaders,
        Host: parsedUrl.host,
        Origin: origin,
      }
    }
    const proReq = handle.request(options, proRes => {
      const chunks = []
      proRes.on('data', data => {
        chunks.push(data)
      })
      proRes.on('end', () => {
        resolve({
          status: proRes.statusCode,
          header: formatHeaders(proRes.rawHeaders),
          body: Buffer.concat(chunks)
        })
      })
    })
    proReq.on('error', reject)
    if (ctx.method !== 'GET') {
      proReq.write(ctx.req.rawBody, err => {
        if (err) reject(err)
        proReq.end()
      })
    } else {
      proReq.end()
    }
  })
}

function formatHeaders(rawHeader) {
  const res = {}
  rawHeader.map((item, index) => {
    if (index % 2 == 0) {
      res[item] = rawHeader[index + 1]
    }
  })
  return res
}

module.exports = proxy



