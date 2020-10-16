import fs from 'fs'
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
    docTitle: '接口开发文档',
    docDesc: fs.readFileSync('./README.md') + ''
  })]
}