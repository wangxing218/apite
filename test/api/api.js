const { api } = require('apite')

api.get('/code', ctx => {
  ctx.captcha()
})

api.post('/msg', { name: '@cname()333' })