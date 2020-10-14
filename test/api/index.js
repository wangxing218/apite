const { api, delay, mock } = require('apite')

/**
 * text
 * @description 这是一个描述的对吧
 * @param {number} name 用户id
 * @param {string} name 用户名
 */
api.get('/text', `Hello apite!`)


// html
api.get('/html', ctx => {
  ctx.html(`<h1>Hello html!</h1>`)
})

/**
 * 这是文档生成工具
 * @description 这是一个描述文件
 * @param {int} id   这个还是要我们来的
 * @param {boole} done 这是一个id啊
 */
api.get('/doc', ctx=>{
  const router = require('apite/src/router')
  ctx.json(router.routes)
})

/**
 * file
 * @description 这是一个描述的对吧
 * @param {string} file 这个不容小
 * @return {string} 返回值
 */
api.get('/file', ctx => {
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
api.get('/image', ctx => {
  ctx.type = 'png'
  ctx.body = Buffer.from(`iVBORw0KGgoAAAANSUhEUgAAAJAAAACQAQMAAADdiHD7AAAABlBMVEUAAABTU1OoaSf/AAAAAXRSTlMAQObYZgAAAFJJREFUeF7t0cENgDAMQ9FwYgxG6WjpaIzCCAxQxVggFuDiCvlLOeRdHR9yzjncHVoq3npu+wQUrUuJHylSTmBaespJyJQoObUeyxDQb3bEm5Au81c0pSCD8HYAAAAASUVORK5CYII=`, 'base64')
})