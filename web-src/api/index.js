/**
 * @sort 1
 * @name 接口示例
 * 接口描述信息，支持html标签
 */
const { api, delay, mock, resp } = require('apite')

// JSON
api.get('/json', {
  msg: 'json'
})


/**
 * @name 模拟数据
 * 更多语法请参考 <a href="http://mockjs.com/examples.html" target="_blank">mockjs</a>
 */
api.get('/mock', mock({
  id: '@id',
  number: '@int(5,9)',
  name: '@name',
  cname: '@cname',
  date: '@dateTime',
  reg: /\w{10}/
}))

// 实时模拟
api.get('/mock-time', ctx => {
  return mock({
    id: '@id',
    number: '@int(5,9)',
    name: '@name',
    cname: '@cname',
    date: '@dateTime',
    reg: /\w{10}/
  })
})

/**
 * @name POST请求
 * 点击在线调试传参数请求看看
 * @param {string} name 名称
 * @param {number} [age=10] 年龄
 * @param {boolean} [online=true] 是否在线
 */
api.post('/post', ctx => {
  ctx.body = ctx.post
})


/**
 * @name PUT请求
 * 点击在线调试传参数请求看看
 * @param {number} id ID
 */
api.put('/put', ctx => {
  ctx.body = ctx.query
})

/**
 * @name DELETE请求
 * 点击在线调试传参数请求看看
 * @param {number} id ID
 */
api.del('/del', ctx => {
  ctx.body = ctx.query
})

/**
 * @name 统一返回成功
 * resp.ok(data, ext) 返回成功
 * resp.fail(msg, code, ext) 返回成功
 * resp.mock(data, ext) 返回成功并mock
 */
api.get('/resp/ok', resp.ok('添加成功'))

/**
 * @name 统一返回失败
 * resp.ok(data, ext) 返回成功
 * resp.fail(msg, code, ext) 返回成功
 * resp.mock(data, ext) 返回成功并mock
 */
api.get('/resp/fail', resp.fail('失败了'))

/**
 * @name 返回成功并mock
 * resp.ok(data, ext) 返回成功
 * resp.fail(msg, code, ext) 返回成功
 * resp.mock(data, ext) 返回成功并mock
 */
api.get('/resp/mock', () => resp.mock({
  'data|10': [{
    id: '@id',
    name: '@cname',
    title: '@title',
    email: '@email'
  }],
  'total|90-1000': 10
}))

// JSONP
api.get('/jsonp', ctx => {
  ctx.jsonp({
    msg: 'jsonp'
  })
})

// 文本
api.get('/text', `Hello apite!`)

// HTML
api.get('/html', ctx => {
  ctx.html(`<h1>Hello html!</h1>`)
})

// 文件
api.get('/file', ctx => {
  ctx.file = './index.js'
})

// 延时返回
api.get('/delay', async ctx => {
  await delay(1000)
  ctx.json({
    msg: 'delay 1000ms'
  })
})

// 验证码
api.get('/captcha', ctx => {
  ctx.captcha()
})

/**
 * @name 代理一
 * 获取微信 accessToken
 * @param {string} [grant_type=client_credential] 获取access_token填写client_credential
 * @param {string} appid 第三方用户唯一凭证
 * @param {string} secret 第三方用户唯一凭证密钥，即appsecret
 */
api.get('/proxy', {}, {
  proxy: {
    target: 'https://api.weixin.qq.com/cgi-bin/token',
    rewrite: '/proxy'
  },
})

/**
 * @name 代理二
 * 微信接口，获取 ticket，当第三个参数为 true时，使用全局config 里的 proxy 配置
 * @param {string} access_token 获取到的access_token
 * @param {string} [type=wx_card] 类型：获取ticket
 */
api.get('/ticket/getticket', {}, true)



// 图片或其他
api.get('/image', ctx => {
  ctx.type = 'png'
  ctx.body = Buffer.from(`iVBORw0KGgoAAAANSUhEUgAAAJAAAACQAQMAAADdiHD7AAAABlBMVEUAAABTU1OoaSf/AAAAAXRSTlMAQObYZgAAAFJJREFUeF7t0cENgDAMQ9FwYgxG6WjpaIzCCAxQxVggFuDiCvlLOeRdHR9yzjncHVoq3npu+wQUrUuJHylSTmBaespJyJQoObUeyxDQb3bEm5Au81c0pSCD8HYAAAAASUVORK5CYII=`, 'base64')
})