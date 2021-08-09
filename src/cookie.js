// cookie格式化
async function parseCookie(ctx) {
  const str = ctx.req.headers['cookie']
  const cookie = {}
  if (!str) return
  str.split(';').map((item) => {
    const arr = item.split('=')
    cookie[arr.shift().trim()] = decodeURIComponent(arr.join('='))
  })
  ctx.cookie = cookie
}

// 写入cookie
async function respCookie(ctx) {
  const arr = ctx._cookieArr
  if (!arr.length) return
  const str = []
  arr.map((item) => {
    const options = item.options || {}
    const itemStr = []
    const value = item.value === null ? '' : encodeURIComponent(item.value)
    itemStr.push(`${item.name}=${value}`)
    if (options.path) {
      itemStr.push(`Path=` + options.path)
    } else {
      itemStr.push(`Path=/`)
    }
    if (options.domain) {
      itemStr.push(`Domain=` + options.domain)
    }
    if (options.httpOnly) {
      itemStr.push(`HttpOnly=true`)
    }
    if (options.secure) {
      itemStr.push(`Secure=true`)
    }
    if (item.value === null) {
      itemStr.push(`Max-Age=-1`)
    } else if (options.maxAge) {
      itemStr.push(`Max-Age=` + options.maxAge)
    }
    str.push(itemStr.join(';'))
  })
  ctx.res.setHeader('Set-Cookie', str)
}

module.exports = {
  parseCookie,
  respCookie,
}
