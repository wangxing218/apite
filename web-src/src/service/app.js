import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import { getData } from './api'
import AppRequest from '../component/app-request'

export default defineComponent({
  components: {AppRequest},
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
    async function initData(){
      const { result } = await getData()
      state.info = {
        title: result.info.title,
        desc: result.info.desc,
      }
      state.data = renderData(result)
    }

    // 格式化数据 
    function renderData(result) {
      const res = [...result.files]
      res.map(item => {
        if (!result.routes) return
        item.routes = []
        result.routes.map(router => {
          if(!router.file || router.file !== item.file) return
          router.doc.name = router.doc.name || router.url
          item.routes.push(router)
        })
      })
      return res
    }

    // 换行替换为p
    function toHtml(text = '') {
      const arr = text.split('\n')
      if (!arr.length) return `<p>${text}</p>`
      return `<p>${arr.join('</p><p>')}</p>`
    }

    // 获取api锚点id
    function getMark(item){
      return 'api_' + item.method.toLowerCase() + item.url
    }

    // 跳转到指定api
    function scrollTo(item){
      const el = document.getElementById(getMark(item))
      el && el.scrollIntoView({
        behavior: 'smooth'
      })
    }

    return {
      ...toRefs(state),
      toHtml,
      getMark,
      scrollTo,
    }
  }
})