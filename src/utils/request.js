import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { removeToken, getToken } from '@/utils/auth'

export function baseUrl() {
  return 'http://localhost:8081'
}

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: baseUrl(), // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      let token = getToken()
      config.headers['X-Token'] = token
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */

  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        // MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        //   confirmButtonText: 'Re-Login',
        //   cancelButtonText: 'Cancel',
        //   type: 'warning'
        // }).then(() => {

        // });
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      }

      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 3 * 1000
      })
      console.log(response, res.message || 'Error');

      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log("error", { error });

    // 1️⃣ 网络 / 超时
    if (!error.response) {
      Message.error('网络异常，请稍后重试')
      return Promise.reject(error)
    }

    const { status, data } = error.response

    // 2️⃣ 统一提取错误文案（非常关键）
    const msg =
      data?.message ||
      '请求失败'

    // 3️⃣ token 失效 / 未登录
    if (status === 401) {
      Message.error(msg || '登录已过期，请重新登录')
      removeToken()
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
      return Promise.reject(data)
    }

    // 4️⃣ 其他业务 / 系统错误
    Message.error(msg)

    // 5️⃣ 只把后端 body 抛下去
    return Promise.reject(data)
  }
)

export default service
