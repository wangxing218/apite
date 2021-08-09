/**
 * @sort 1
 * @name 用户模块1
 * 接口描述信息，支持html标签
 */
const { api, delay, mock, resp } = require('apite')

// JSON
api.get('/func/json', {
  msg: 'json',
})

/**
 * @name 模拟数据
 * 更多语法请参考 <a href="http://mockjs.com/examples.html" target="_blank">mockjs</a>
 */
api.get(
  '/func/mock',
  mock({
    id: '@id',
    number: '@int(5,9)',
    name: '@name',
    cname: '@cname',
    date: '@dateTime',
    reg: /\w{10}/,
  }),
)

// 实时模拟
api.get('/func/mock-time', () =>
  mock({
    id: '@id',
    number: '@int(5,9)',
    name: '@name',
    cname: '@cname',
    date: '@dateTime',
    reg: /\w{10}/,
  }),
)

/**
 * @name POST请求
 * 点击在线调试传参数请求看看
 * @param {string} name 名称
 * @param {number} [age=10] 年龄
 * @param {boolean} [online=true] 是否在线
 */
api.post('/func/post', (ctx) => {
  ctx.body = {
    query: ctx.query,
    post: ctx.post,
  }
})

/**
 * @name PUT请求
 * 点击在线调试传参数请求看看
 * @param {number} id ID
 */
api.put('/func/put', (ctx) => {
  ctx.body = {
    query: ctx.query,
    post: ctx.post,
  }
})

/**
 * @name DELETE请求
 * 点击在线调试传参数请求看看
 * @param {number} id ID
 */
api.del('/func/del', (ctx) => {
  ctx.body = {
    query: ctx.query,
    post: ctx.post,
  }
})

/**
 * url参数
 * @param {number} id 用户id
 * @param {string} name 用户名
 */
api.post('/func/user/{id}/{name}', (ctx) => {
  ctx.body = {
    params: ctx.params,
    post: ctx.post,
  }
})

// 获取cookie
api.get('/func/cookie', (ctx) => {
  return ctx.cookie
})

// 设置cookie
api.get('/func/set-cookie', (ctx) => {
  ctx.setCookie('user', mock('@name'))
  ctx.setCookie('time', new Date(), {
    maxAge: 15,
    httpOnly: true,
  })
  return resp.ok(ctx.cookie)
})

/**
 * @name 统一返回成功
 * resp.ok(data, ext) 返回成功
 * resp.fail(msg, code, ext) 返回失败
 * resp.mock(data, ext) 返回成功并mock
 * resp.list(list, total, ext) 返回列表
 * 返回格式可按要求在config里定制
 *
 */
api.get('/func/resp/ok', resp.ok('添加成功'))

/**
 * @name 统一返回失败
 * resp.ok(data, ext) 返回成功
 * resp.fail(msg, code, ext) 返回失败
 * resp.mock(data, ext) 返回成功并mock
 * resp.list(list, total, ext) 返回列表
 * 返回格式可按要求在config里定制
 */
api.get('/func/resp/fail', resp.fail('失败了'))

/**
 * @name 统一返回mock
 * resp.ok(data, ext) 返回成功
 * resp.fail(msg, code, ext) 返回失败
 * resp.mock(data, ext) 返回成功并mock
 * resp.list(list, total, ext) 返回列表
 * 返回格式可按要求在config里定制
 */
api.get('/func/resp/mock', () =>
  resp.mock({
    'data|10': [
      {
        id: '@id',
        name: '@cname',
        title: '@title',
        email: '@email',
      },
    ],
    'total|90-1000': 10,
  }),
)

/**
 * @name 统一返回列表
 * resp.ok(data, ext) 返回成功
 * resp.fail(msg, code, ext) 返回失败
 * resp.mock(data, ext) 返回成功并mock
 * resp.list(list, total, ext) 返回列表
 * 返回格式可按要求在config里定制
 */
api.get('/func/resp/list', (ctx) => {
  const data = mock({
    'list|10': [
      {
        id: '@id',
        name: '@cname',
        title: '@title',
        email: '@email',
      },
    ],
  })
  ctx.body = resp.list(data.list, 98)
})

// JSONP
api.get('/func/jsonp', (ctx) => {
  ctx.jsonp({
    msg: 'jsonp',
  })
})

// 文本
api.get('/func/text', `Hello apite!`)

// HTML
api.get('/func/html', (ctx) => {
  ctx.html(`<h1>Hello html!</h1>`)
})

// 文件
api.get('/func/file', (ctx) => {
  ctx.file = './index.js'
})

// 延时返回
api.get('/func/delay', async (ctx) => {
  await delay(1000, 4000)
  ctx.json({
    msg: 'delay 1000ms to 4000ms',
  })
})

// 验证码
api.get('/func/captcha', (ctx) => {
  ctx.captcha()
})

/**
 * @name 代理一
 * 获取微信 accessToken
 * @param {string} [grant_type=client_credential] 获取access_token填写client_credential
 * @param {string} appid 第三方用户唯一凭证
 * @param {string} secret 第三方用户唯一凭证密钥，即appsecret
 */
api.get(
  '/func/proxy',
  {},
  {
    proxy: {
      target: 'https://api.weixin.qq.com/cgi-bin/token',
      rewrite: '/proxy',
    },
  },
)

/**
 * @name 代理二
 * 微信接口，获取 ticket，当第三个参数为 true时，使用全局config 里的 proxy 配置
 * @param {string} access_token 获取到的access_token
 * @param {string} [type=wx_card] 类型：获取ticket
 */
api.get('/func/ticket/getticket', {}, true)

// 图片或其他
api.get('/func/image', (ctx) => {
  ctx.type = 'png'
  ctx.body = Buffer.from(
    `iVBORw0KGgoAAAANSUhEUgAAAJAAAACQAQMAAADdiHD7AAAABlBMVEUAAABTU1OoaSf/AAAAAXRSTlMAQObYZgAAAFJJREFUeF7t0cENgDAMQ9FwYgxG6WjpaIzCCAxQxVggFuDiCvlLOeRdHR9yzjncHVoq3npu+wQUrUuJHylSTmBaespJyJQoObUeyxDQb3bEm5Au81c0pSCD8HYAAAAASUVORK5CYII=`,
    'base64',
  )
})

/**
 * @name POST请求
 * 点击在线调试传参数请求看看
 * @param {string} name 名称
 * @param {number} [age=10] 年龄
 * @param {boolean} [online=true] 是否在线
 */
api.post('/func/post1', (ctx) => {
  ctx.body = {
    query: ctx.query,
    post: ctx.post,
  }
})

/**
 * @name POST请求
 * 点击在线调试传参数请求看看
 * @param {string} name 名称
 * @param {number} [age=10] 年龄
 * @param {boolean} [online=true] 是否在线
 */
api.post('/func/post2', (ctx) => {
  ctx.body = {
    query: ctx.query,
    post: ctx.post,
  }
})

/**
 * @name POST请求
 * 点击在线调试传参数请求看看
 * @param {string} name 名称
 * @param {number} [age=10] 年龄
 * @param {boolean} [online=true] 是否在线
 */
api.post('/func/post3', (ctx) => {
  ctx.body = {
    query: ctx.query,
    post: ctx.post,
  }
})

/**
 * @name POST请求
 * 点击在线调试传参数请求看看
 * @param {string} name 名称
 * @param {number} [age=10] 年龄
 * @param {boolean} [online=true] 是否在线
 */
api.post('/func/post4', (ctx) => {
  ctx.body = {
    query: ctx.query,
    post: ctx.post,
  }
})

/**
 * @name POST请求
 * 点击在线调试传参数请求看看
 * @param {string} name 名称
 * @param {number} [age=10] 年龄
 * @param {boolean} [online=true] 是否在线
 */
api.post('/func/post5', (ctx) => {
  ctx.body = {
    query: ctx.query,
    post: ctx.post,
  }
})

/**
 * @name POST请求
 * 点击在线调试传参数请求看看
 * @param {string} name 名称
 * @param {number} [age=10] 年龄
 * @param {boolean} [online=true] 是否在线
 */
api.post('/func/post6', (ctx) => {
  ctx.body = {
    query: ctx.query,
    post: ctx.post,
  }
})

/**
 * @name POST请求
 * 点击在线调试传参数请求看看
 * @param {string} name 名称
 * @param {number} [age=10] 年龄
 * @param {boolean} [online=true] 是否在线
 */
api.post('/func/post7', (ctx) => {
  ctx.body = {
    query: ctx.query,
    post: ctx.post,
  }
})

/**
 * @name POST请求
 * 点击在线调试传参数请求看看
 * @param {string} name 名称
 * @param {number} [age=10] 年龄
 * @param {boolean} [online=true] 是否在线
 */
api.post('/func/post8', (ctx) => {
  ctx.body = {
    query: ctx.query,
    post: ctx.post,
  }
})

/**
 * @name POST请求
 * 点击在线调试传参数请求看看
 * @param {string} name 名称
 * @param {number} [age=10] 年龄
 * @param {boolean} [online=true] 是否在线
 */
api.post('/func/post9', (ctx) => {
  ctx.body = {
    query: ctx.query,
    post: ctx.post,
  }
})

/**
 * @name POST请求
 * 点击在线调试传参数请求看看
 * @param {string} name 名称
 * @param {number} [age=10] 年龄
 * @param {boolean} [online=true] 是否在线
 */
api.post('/func/post10', (ctx) => {
  ctx.body = {
    query: ctx.query,
    post: ctx.post,
  }
})
