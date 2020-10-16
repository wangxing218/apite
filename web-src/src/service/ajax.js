import axios from 'axios'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { getBaseUrl } from './common'
nprogress.configure({
  showSpinner: false
})

// 通用配置
const baseConfig = {
  baseURL: getBaseUrl(),
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  },
  timeout: 30e3,
  error: true,
  successCode: 0,
  progress: true,
}

/**
 * ajax请求
 * @param {*} opt 
 */
const ajax = (opt) => {
  // 请求处理
  const config = {
    ...baseConfig,
    ...opt,
  }
  if (config.progress === true) {
    nprogress.start()
    nprogress.inc(0.6)
  }
  if (config.commonData) {
    if (config.method == 'get') {
      config.params = {
        ...config.commonData,
        ...config.params,
      }
    } else {
      config.data = {
        ...config.commonData,
        ...config.data,
      }
    }
  }

  return new Promise((resolve, reject) => {
    // 自动处理错误
    function handleError(err) {
      if (config.error === true) {
        // Vue.prototype.$toast(err.msg)
      } else if (typeof config.error == 'function') {
        config.error(err)
      }
      reject(err)
    }
    // 发送请求
    axios(config).then(resp => {
      const res = resp.data
      if (typeof res === 'string') resolve(res)
      if (res.code !== config.successCode) {
        handleError(res)
        return
      }
      resolve(res)
    }).catch(() => {
      handleError({
        code: 900,
        msg: '服务器出故障了~',
      })
    }).finally(() => {
      nprogress.done()
    })
  })
}

/**
 * 提交get请求
 * @param {*} url 
 * @param {*} params
 * @param {*} opt 
 */
export const get = (url, params = {}, opt) => {
  return ajax({
    ...opt,
    url,
    params,
    method: 'get'
  })
}

/**
 * 提交post请求
 * @param {*} url 
 * @param {*} data 
 * @param {*} opt 
 */
export const postForm = (url, data = {}, opt) => {
  return ajax({
    ...opt,
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    postForm: true,
    url,
    data,
  })
}

/**
 * 提交post Json请求
 * @param {*} url 
 * @param {*} data 
 * @param {*} opt 
 */
export const post = (url, data = {}, opt) => {
  return ajax({
    ...opt,
    method: 'post',
    url,
    data,
  })
}

/**
 * ajax上传文件请求
 * @param {*} url 
 * @param {*} data 
 * @param {*} opt 
 */
export const postFile = (url, data = {}, opt) => {
  let formData = new FormData()
  for (let key in data) {
    formData.append(key, data[key])
  }
  return ajax({
    ...opt,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    url,
    data: formData,
  })
}

export default {
  get,
  post,
  postFile,
  postForm,
}