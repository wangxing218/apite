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
  configureServer: [viteExt()]
}