// 公共方法

export const isDev = process.env.NODE_ENV === 'dev'

export const getBaseUrl = () => {
  if (isDev) return '/api/'
  const arr = location.pathname.match(/\/(.+)\//i)
  return arr ? arr[0] : './'
}

// 将json序列化为url请求体,从jquery中剥离出来的。
export function urlEncode(obj) {
  var prefix,
    res = []

  function add(key, value) {
    res[res.length] = encodeURIComponent(key) + '=' + encodeURIComponent(value == null ? '' : value)
  }

  function buildParams(prefix, obj) {
    var name
    var rbracket = /\[\]$/
    if (Array.isArray(obj)) {
      obj.forEach(function (value, index) {
        if (rbracket.test(prefix)) {
          add(prefix, value)
        } else {
          buildParams(prefix + '[' + (typeof value === 'object' && value != null ? index : '') + ']', value)
        }
      })
    } else if (typeof obj === 'object') {
      for (name in obj) {
        buildParams(prefix + '[' + name + ']', obj[name], add)
      }
    } else {
      add(prefix, obj)
    }
  }
  for (prefix in obj) {
    buildParams(prefix, obj[prefix])
  }
  return res.join('&')
}

export default {
  isDev,
  getBaseUrl,
}
