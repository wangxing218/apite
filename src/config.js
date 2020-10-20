
// apite默认配置
const config = {
  // 服务端口
  port: 3000,
  // 独立配置文件
  config: 'apite.config.js',
  // 代理设置
  proxy: null,
  // api所在目录，相对根目录或绝对路径，默认为 api 目录
  dir: 'api',
  // 静态文件目录，相对根目录或绝对路径,如： 'public'，默认为 null 不启用静态文件渲染
  public: null,
  // 文件兼听延时,为 0 时不兼听
  watchDelay: 300,
  // 是否格式化json输出
  jsonFormat: true,
  // 是否全局mock
  mock: false,
  // 请求地址前辍， cli命令行时默认为空，webpack,vite等插件默认为 '/api'
  prefix: '',
  // 是否严格匹配请求类型
  strictMethod: false,
  // 返回数据格式
  defaultType: '',
  // 设置跨域，如: '*'
  crossDomain: '',
  // jsonp请求callback请求参数
  jsonpCallback: 'callback',
  // 文档生成路径，为空时不生成文档
  doc: '/',
  // 文档标题
  docTitle: '',
  // 文档描述，文本或markdown文档地址，相对于根目录
  docDesc: '',
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