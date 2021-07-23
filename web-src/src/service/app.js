import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { getData } from './api'
import AppRequest from '../component/app-request'

import '../asset/md.css'
import marked from 'marked'

export default defineComponent({
  components: { AppRequest },
  setup() {
    const state = reactive({
      // 文档信息
      info: {},
      // 数据列表
      data: [],
      // 是否显示目录
      showMenu: false,
    })

    // 初始化
    onMounted(async () => {
      initData()
    })

    // 获取数据
    async function initData() {
      const { result } = await getData()
      if (result.info.desc) {
        result.info.desc = await parseMarkDown(result.info.desc)
      }
      state.info = {
        title: result.info.title,
        desc: result.info.desc,
        version: result.info.version,
      }
      state.data = renderData(result)
    }

    // 格式化md文档
    async function parseMarkDown(str) {
      return marked.parse(str) || ''
    }

    // 格式化数据
    function renderData(result) {
      const res = [...result.files]
      res.map((item) => {
        if (!result.routes) return
        item.routes = []
        result.routes.map((router) => {
          if (!router.file || router.file !== item.file) return
          router.doc.name = router.doc.name || router.url
          item.routes.push(router)
        })
      })
      return res
    }

    // 换行替换p标签
    function toHtml(text = '') {
      const arr = text.split(/[\r|\n]/)
      if (!arr.length) return `<p>${text}</p>`
      return `<p>${arr.join('</p><p>')}</p>`
    }

    // 获取api锚点id
    function getMark(item) {
      return 'api_' + item.method.toLowerCase() + item.url
    }

    // 跳转到指定api
    function scrollTo(item) {
      const el = document.getElementById(getMark(item))
      el &&
        el.scrollIntoView({
          behavior: 'smooth',
        })
    }

    // 返回顶部
    function scrollTop() {
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth',
      })
    }

    return {
      ...toRefs(state),
      toHtml,
      getMark,
      scrollTo,
      scrollTop,
    }
  },
})
