import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { vite2Ext } from 'apite'

export default defineConfig({
  base: './',
  build: {
    assetsDir: '_doc_static',
    outDir: '../web',
    emptyOutDir: true,
  },
  plugins: [
    vue(),
    // mock
    vite2Ext({}),
  ],
})
