import { viteExt } from 'apite'
export default {
  base: './',
  outDir: '../web',
  assetsDir: '_doc_static',
  configureServer: [viteExt({
    docTitle: '接口开发文档',
    docDesc: '文档的描述 \n 这个不错的'
  })]
}