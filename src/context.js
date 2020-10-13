const Mock = require('../lib/mock')
const svgCaptcha = require('../lib/captcha')

class context {
  constructor(req, res) {
    this.req = req
    this.res = res
    this.method = req.method
    this.header = {}
    this.query = {}
    this.post = {}
    this.status = 200
    this.type = ''
    this.body = null
    this.path = ''
    this.url = ''
    this.file = null
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
      // height: 40,
      // width: 126,
      ...config
    }
    const captcha = svgCaptcha.create(opt)
    this.type = 'svg'
    this.body = captcha.data
    return captcha
  }
}

module.exports = context