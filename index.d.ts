
interface Api {
  get(url: string, handle: Function): void
  post(url: string, handle: Function): void
  all(url: string, handle: Function): void
}

interface ExtOptions {
  prefix: string = 'api'
  jsonFormat: boolean = true
  watchDelay: number = 300
  dir: string = 'api'
  doc: string = '/'
  docTitle: string = ''
  docDesc: string = ''
}

declare module 'apite' {
  const api: Api;
  function delay(from: number, to?: number): Promise<void>
  function mock(mockObj: any): any
  function webpackExt(options: ExtOptions): void
  function viteExt(options: ExtOptions): void
}