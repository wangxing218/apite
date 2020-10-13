const { api, delay, mock } = require('apite')

// text
api.get('/text', `Hello apite!`)

// html
api.get('/html', ctx => {
  ctx.html(`<h1>Hello html!</h1>`)
})

// file
api.get('/file', ctx=>{
  ctx.sendFile('./index.js')
})

// json
api.get('/json', {
  code: 1,
  msg: 'ok'
})

// jsonp
api.get('/jsonp', ctx => {
  ctx.jsonp({
    msg: 'jsonp ok'
  })
})

// delay
api.get('/delay', async ctx => {
  await delay(1000)
  ctx.json({
    msg: 'delay 1000ms'
  })
})

// mock
api.get('/mock', mock({
  id: '@id',
  name: '@cname'
}))

// mock every request
api.get('/mock2', ctx => {
  ctx.body = mock({
    id: '@id',
    time: '@dateTime'
  })
})

// captcha
api.get('/captcha', ctx => {
  ctx.captcha()
})

// proxy
api.get('/proxy', { msg: 'proxy' }, {
  proxy: {
    target: 'https://api.weixin.qq.com/cgi-bin/token',
    rewrite: '/proxy'
  },
})

// image and any type
api.get('/image', ctx=>{
  ctx.type = 'png'
  ctx.body = Buffer.from(`iVBORw0KGgoAAAANSUhEUgAAAJAAAACQAQMAAADdiHD7AAAABlBMVEUAAABTU1OoaSf/AAAAAXRSTlMAQObYZgAAAFJJREFUeF7t0cENgDAMQ9FwYgxG6WjpaIzCCAxQxVggFuDiCvlLOeRdHR9yzjncHVoq3npu+wQUrUuJHylSTmBaespJyJQoObUeyxDQb3bEm5Au81c0pSCD8HYAAAAASUVORK5CYII=`, 'base64')
})