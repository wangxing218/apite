
// apite默认配置
const config = {
  // 服务端口
  port: 3000,
  // 代理请求地址
  proxy: null,
  // 模拟数据所在目录
  dir: 'api',
  // 静态文件目录
  public: '',
  // 文件兼听延时
  watchDelay: 300,
  // 是否格式化json输出
  jsonFormat: true,
  // 是否全局mock
  mock: false,
  // 请求前辍
  prefix: '',
  // 是否严格匹配请求类型
  strictMethod: false,
  // 默认返回格式
  defaultType: '',
  // 允许跨域请求
  crossDomain: '',
  // jsonp请求callback请求参数
  jsonpCallback: 'callback',
}

// 覆盖配置
function setConfig(options = {}) {
  Object.keys(options).map(key => {
    if (!config.hasOwnProperty(key)) return
    config[key] = options[key]
  })
}
module.exports = {
  config,
  setConfig,
}