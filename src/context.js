const Mock = require('../lib/mock')

class context {
  constructor(req, res) {
    this.req = req
    this.res = res
    this.method = req.method
    this.header = {}
    this.query = {}
    this.cookie = {}
    this.params = {}
    this.post = {}
    this.status = 200
    this.type = ''
    this.body = null
    this.path = ''
    this.url = ''
    this.file = null
    this._cookieArr = []
  }

  json(body) {
    this.type = 'json'
    this.body = body
  }
  jsonp(body) {
    this.type = 'jsonp'
    this.body = body
  }
  html(body) {
    this.type = 'html'
    this.body = body
  }
  sendFile(file) {
    this.file = file
  }
  error(status = 404, body = '404 not found') {
    this.type = 'txt'
    this.status = status
    this.body = body
  }
  captcha(config = {}) {
    const opt = {
      color: '#0080ff',
      background: '#f2f6fc',
      ...config,
    }
    const svgCaptcha = require('../lib/captcha')
    const captcha = svgCaptcha.create(opt)
    this.type = 'svg'
    this.body = captcha.data
    return captcha
  }
  setCookie(name, value, options) {
    this._cookieArr.push({
      name,
      value,
      options,
    })
  }
}

module.exports = context
