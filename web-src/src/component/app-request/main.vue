<template>
  <div class="req">
    <div class="post">
      <ul class="tab">
        <li :class="{ on: req.tab === 1 }" @click="req.tab = 1">Params</li>
        <li :class="{ on: req.tab === 2 }" @click="req.tab = 2">Headers</li>
        <li :class="{ on: req.tab === 3 }" @click="req.tab = 3">Body</li>
      </ul>
      <ul class="form" v-show="req.tab === 1">
        <li v-for="(item, index) in req.params" :key="index">
          <input v-model="item.name" type="text" class="input key" placeholder="key" />
          <span class="del" title="删除" @click="handleDel(index)">+</span>
          <input v-model="item.value" type="text" class="input" placeholder="value" />
        </li>
      </ul>
      <ul class="form" v-show="req.tab === 2">
        <li v-for="(item, index) in req.headers" :key="index">
          <input type="text" v-model="item.name" class="input hkey" placeholder="key" />
          <span class="del" title="删除" @click="handleDel(index)">+</span>
          <input type="text" v-model="item.value" class="input" placeholder="value" />
        </li>
      </ul>
      <div class="text-area" v-show="req.tab === 3">
        <textarea spellcheck="false" v-model="req.body"></textarea>
      </div>
      <div class="action">
        <div class="tiny-btn none" title="添加参数" @click="handleAdd">
          <span class="tiny-icon ti-add"></span>
        </div>
        <div class="tiny-btn none" title="重置" @click="handleReset">
          <span class="tiny-icon ti-refresh"></span>
        </div>
        <div class="tiny-btn none" v-show="req.tab === 2" title="设为公共请求头" @click="handleSaveHeader">
          <span class="tiny-icon ti-header"></span>
        </div>
        <div class="action-right">
          <div class="tiny-btn left" @click="handlePost">发送</div>
        </div>
      </div>
    </div>
    <div class="resp">
      <ul class="tab">
        <li :class="{ on: resp.tab == 1 }" @click="resp.tab = 1">数据</li>
        <li :class="{ on: resp.tab == 2 }" @click="resp.tab = 2">响应头</li>
      </ul>
      <div class="resp-data" v-show="resp.tab == 1">
        <div class="resp-img" v-if="resp.type === 'image'">
          <img :src="resp.body" />
        </div>
        <div class="text-area" v-else>
          <textarea spellcheck="false" v-model="resp.body"></textarea>
        </div>
      </div>
      <ul class="form resp-con" v-show="resp.tab == 2">
        <li v-for="(val, key) in resp.headers" :key="key">
          <b>{{ transformCase(key) }}:</b>
          {{ val }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../asset/_var';
$min-height: 240px;
.req {
  border: 2px dashed #eee;
  margin: 15px auto 10px;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}
.post {
  width: 50%;
  background-color: #fafafa;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  min-height: 300px;
}
.resp {
  flex: 1;
  width: 1%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}
@media screen and (max-width: 980px) {
  .req {
    flex-direction: column;
  }
  .post {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #eee;
    min-height: 220px;
  }
  .resp {
    width: 100%;
    min-height: 200px;
  }
  .text-area > textarea {
    min-height: 140px;
  }
  .resp-data {
    .text-area > textarea {
      min-height: 190px;
    }
  }
}
.tab {
  display: flex;
  > li {
    flex: 1;
    text-align: center;
    font-size: 12px;
    height: 33px;
    line-height: 32px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    &:hover {
      color: #0080ff;
    }
    &.on {
      color: #0080ff;
      border-bottom-color: #0080ff;
    }
  }
}
.action {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.action-right {
  text-align: right;
  flex: 1;
  width: 1%;
}
.form {
  position: relative;
  padding: 10px;
  padding-bottom: 0;
  overflow: hidden;
  overflow-y: auto;
  flex: 1;
  height: 1%;
  > li {
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .del {
      user-select: none;
      color: #ccc;
      font-size: 18px;
      font-weight: lighter;
      &:hover {
        color: #0080ff;
      }
      display: inline-block;
      text-align: center;
      padding: 5px;
      transform: rotateZ(45deg);
      cursor: pointer;
    }
    > .input + .input {
      margin-left: 10px;
    }
    > .key {
      width: 30%;
    }
    > .hkey {
      width: 60%;
    }
    .label {
      font-weight: bold;
      width: 50%;
    }
    .text {
      color: #999;
    }
  }
  .input {
    appearance: none;
    display: block;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 3px;
    height: 32px;
    font-size: 14px;
    line-height: 18px;
    padding: 6px 10px;
    outline: none;
    &:focus {
      border-color: #999;
    }
  }
  &.resp-con {
    > li {
      @include textHidden;
      font-size: 12px;
      display: block;
      > b {
        font-size: 13px;
      }
    }
  }
}
.text-area {
  position: relative;
  flex: 1;
  > textarea {
    appearance: none;
    background-color: #fff;
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    resize: vertical;
    border: none;
    padding: 5px 10px;
    font-size: 13px;
    line-height: 1.5;
    font-family: Consolas, Arial, Helvetica, sans-serif;
    outline: none;
    word-break: break-all;
    white-space: pre-wrap;
  }
}
.resp-data {
  flex: 1;
  position: relative;
  > .text-area {
    height: 100%;
  }
}
.resp-img {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  > img {
    max-height: 100%;
    max-width: 100%;
  }
}
.tiny-icon {
  font-family: 'ui-icon';
}
.ti-add:before {
  content: '\e623';
}
.ti-refresh:before {
  content: '\e61b';
}
.ti-header:before {
  content: '\e666';
}
</style>

<script>
import { defineComponent, onMounted, reactive, toRefs } from 'vue'
import axios from 'axios'
import nprogress from 'nprogress'
import { getBaseUrl, urlEncode } from '../../service/common'
import Toast from '../app-toast'

const ajax = axios.create({
  baseURL: getBaseUrl(),
})

export default defineComponent({
  props: {
    // 路由数据
    router: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, ctx) {
    const state = reactive({
      req: {
        tab: 1,
        headers: [...pubHeaders()],
        body: '',
        params: [],
        isParamsUrl: false,
        isGet: true,
      },
      resp: {
        tab: 1,
        type: 'json',
        body: '',
        headers: [],
      },
    })
    onMounted(() => {
      renderData()
    })

    // 提取数据
    function renderData() {
      const router = { ...props.router }
      if (!router.doc) return
      if (!router.doc.params) return
      const fmtBody = formatBody()
      state.req.isParamsUrl = !!/{\w+}/i.test(router.url)
      state.req.isGet = router.method === 'GET'
      if (state.req.isParamsUrl || state.req.isGet) {
        state.req.params = fmtBody.arr
        if (!state.req.isGet) {
          state.req.body = '{}'
        }
      } else {
        state.req.body = state.req.isParamsUrl ? '{}' : parseJson(fmtBody.res)
        state.req.tab = 3
      }
    }

    // 删除参数
    function handleDel(index) {
      if (state.req.tab == 1) {
        state.req.params.splice(index, 1)
      } else {
        state.req.headers.splice(index, 1)
      }
    }
    // 点击添加
    function handleAdd() {
      switch (state.req.tab) {
        case 1:
          state.req.params.push({
            name: 'key' + (state.req.params.length + 1),
            value: '',
          })
          break
        case 2:
          state.req.headers.push({
            name: 'Header-Key' + (state.req.headers.length + 1),
            value: '',
          })
          break
        case 3:
          if (state.req.isGet) return
          const bodyTemp = strToJson(state.req.body)
          const keyLen = Object.keys(bodyTemp).length || 0
          bodyTemp['key' + (keyLen + 1)] = ''
          state.req.body = parseJson(bodyTemp)
          break
        default:
          break
      }
    }

    // 恢复参数
    function handleReset() {
      state.req.params = []
      state.req.headers = [...pubHeaders()]
      state.req.body = ''
      state.resp.headers = []
      state.resp.body = ''
      renderData()
    }

    // 设为公共请求头
    function handleSaveHeader() {
      console.log(state.req.headers)
      pubHeaders(state.req.headers)
      Toast.show('保存成功')
    }

    // 获取或存储公共请求头
    function pubHeaders(data) {
      if (data) {
        if (!Object.keys(data).length) {
          window.localStorage.removeItem('_apite_pub_headers')
          return false
        }
        window.localStorage.setItem('_apite_pub_headers', JSON.stringify(state.req.headers))
        return true
      } else {
        const store = window.localStorage.getItem('_apite_pub_headers')
        return JSON.parse(store || '[]')
      }
    }

    // 发送ajax请求
    function handlePost() {
      const router = props.router
      let params = {}
      let data = {}
      let headers = {}
      let url = router.url
      // 请求数据
      if (state.req.params.length) {
        state.req.params.forEach((item) => {
          params[item.name] = item.value
        })
      }
      if (!state.req.isGet) {
        data = strToJson(state.req.body)
      }
      // url参数替换
      if (state.req.isParamsUrl) {
        url = url.replace(/{(\w+)}/gi, (a, key) => {
          const value = params[key]
          if (value !== undefined) {
            delete params[key]
            return encodeURIComponent(value)
          }
          return ''
        })
      }
      // 通配符替换
      if (url.indexOf('*') === url.length - 1) {
        url = url.replace(/\*+$/, '')
      }

      // 头
      state.req.headers.map((item) => {
        if (!item.name) return
        headers[item.name] = item.value
      })

      // form表单提交
      const isForm = Object.keys(headers).filter((key) => {
        return key.toLowerCase() === 'content-type' && headers[key].indexOf('application/x-www-form') > -1
      })
      if (isForm.length) {
        data = urlEncode(data)
      }
      nprogress.start()
      nprogress.inc(0.6)
      ajax({
        url: url,
        method: router.method,
        headers,
        params,
        data: state.req.isGet ? undefined : data,
      })
        .then(parseBody)
        .catch((err) => {
          state.resp.type = 'text'
          state.resp.body = err
        })
        .finally(() => {
          nprogress.done()
        })
    }

    // 按类型对params 数据 进行格式化
    function formatBody(res = {}) {
      const arr = []
      props.router.doc.params.forEach((item) => {
        const type = item.type.toLowerCase()
        let value = item.default || ''
        if (['number', 'int', 'integer', 'double', 'float'].includes(type)) {
          value = Number(item.default || item.value)
          value = isNaN(value) ? 0 : value
        } else if (['boolean', 'bool'].includes(type)) {
          value = item.value === undefined ? item.default : item.value
          value = value === 'false' || value === '0' || value === '' ? false : true
        }
        arr.push({
          ...item,
          value,
        })
        res[item.name] = value
      })
      return {
        res,
        arr,
      }
    }

    // 处理返回的数据
    function parseBody(resp) {
      state.resp.headers = resp.headers
      const contentType = resp.headers['content-type']
      if (contentType.indexOf('image/') === 0) {
        state.resp.type = 'image'
        const searchChar = resp.request.responseURL.indexOf('?') + 1 ? '&' : '?'
        state.resp.body = resp.request.responseURL + searchChar + '_r=' + Date.now()
        return
      }
      state.resp.body = typeof resp.data == 'string' ? resp.data : parseJson(resp.data)
      state.resp.type = 'text'
    }

    // json格式化
    function parseJson(json) {
      return JSON.stringify(json, null, 2)
    }

    // 字符串转json
    function strToJson(str) {
      try {
        const res = eval(`(${str})`)
        if (res && typeof res === 'object') return res
        return {}
      } catch (error) {
        return {}
      }
    }

    // 大小写转换
    function transformCase(str = '') {
      return str.replace(/[a-z]/, (a) => a.toUpperCase()).replace(/\-[a-z]/g, (a) => a.toUpperCase())
    }

    return {
      ...toRefs(state),
      handleReset,
      handleSaveHeader,
      handleAdd,
      handlePost,
      handleDel,
      transformCase,
    }
  },
})
</script>