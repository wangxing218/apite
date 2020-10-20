
interface RouterApi {
  get(url: string, handle: Function | string, options: boolean | MethodOptions): void
  post(url: string, handle: Function | string, options: boolean | MethodOptions): void
  put(url: string, handle: Function | string, options: boolean | MethodOptions): void
  del(url: string, handle: Function | string, options: boolean | MethodOptions): void
  all(url: string, handle: Function | string, options: boolean | MethodOptions): void
}
interface ProxyConfig {
  target: string,
  rewrite?: boolean | string | {
    [key: string]: string
  }
}

interface MethodOptions {
  proxy: string | ProxyConfig
}

interface ExtOptions {
  // 独立配置文件，默认为 apite.config.js
  config: string
  // 代理设置
  proxy: string | null | ProxyConfig
  // api所在目录，相对根目录或绝对路径，默认为 api 目录
  dir: string
  // 静态文件目录，相对根目录或绝对路径如： 'public'，默认为 null 不启用静态文件渲染
  public: string | null
  // 文件兼听延时为 0 时不兼听
  watchDelay: number
  // 是否格式化json输出
  jsonFormat: boolean
  // 是否全局mock
  mock: boolean
  // 请求地址前辍， cli命令行时默认为空，webpack,vite等插件默认为 '/api'
  prefix: string
  // 是否严格匹配请求类型
  strictMethod: boolean
  // 返回数据格式
  defaultType: string
  // 设置跨域，如: '*'
  crossDomain: string
  // jsonp请求callback请求参数
  jsonpCallback: string
  // 文档生成路径，为空时不生成文档
  doc: string
  // 文档标题
  docTitle: string
  // 文档描述，文本或markdown文档地址，相对于根目录
  docDesc: string
}

interface ApiteConfig extends ExtOptions {
  // 服务端口
  port: number
}

interface ApiteRespDto {
  code: number
  msg: string
  result?: any | [any]
  total?: number
  [key: string]: any
}
interface ApiteResp {
  ok(result: any, ext: object): ApiteRespDto
  mock(result: any, ext: object): ApiteRespDto
  fail(msg: string, code: number, ext: object): ApiteRespDto
  list(data: [any], total: number, ext: object): ApiteRespDto
  info(info: ApiteRespDto): ApiteRespDto
}

declare module 'apite' {
  const api: RouterApi
  const resp: ApiteResp
  function delay(from: number, to?: number): Promise<void>
  function mock(mockObj: any): any
  function webpackExt(options: ExtOptions): Function
  function viteExt(options: ExtOptions): Function
}