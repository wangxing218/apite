import { viteExt } from 'apite'
export default {
  base: './',
  outDir: '../web',
  assetsDir: '_doc_static',
  optimizeDeps: {
    include: [
      'marked/lib/marked.esm'
    ]
  },
  configureServer: [viteExt({
    resp:{
      // code: ['errCode', '000000'],
      // msg: ['message', '成功'],
      // fail: ['失败了', '999999'],
      // result: ['data'],
      // total: ['count']
    }
  })]
}