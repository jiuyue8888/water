import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import router from '@/router'

// import store from '@/store'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // 当跨域请求时发送cookie
  timeout: 30000 // 请求超时
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    // if (store.getters.token) {
    //   // 让每个请求携带 token
    //   config.headers['Token'] = getToken()
    // }
	let lang=localStorage.getItem('language')=='ZH'?'zh_TW':localStorage.getItem('language')=='EN'?'en_US':'zh_TW'//zh_TW (繁体) en_US (英文)
	config.headers['lang'] = lang
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
    // console.log(res)

    // 如果状态码不是200，则判断为错误
    if(res.code == 20000 || res.code == 200){
      return res
    } else if (res.code === 50008 || res.code === 50012 || res.code === 503) {
      // 50008:非法令牌;50012:其他客户登录;503:令牌过期;
      // 重新登陆
      // MessageBox.confirm('由于您长时间未操作，点击确认后返回首页', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   customClass:'errorConfirm',
      //   type: 'warning'
      // }).then(() => {

      // })
      sessionStorage.removeItem("loginState");
      window.location.href = '/'

      return Promise.reject(res.msg || 'error')
    }else if(res.code == 500){
      if(res.msg){
        Message({
          message: res.msg || 'error',
          type: 'error',
          offset:150
        })
      }
      return res
      // return Promise.reject(res.msg || 'error')
    }else{
      return res
    }
  },
  error => {
    console.log('请求失败' + error.response) // for debug
    // console.log('请求失败' + error.response) // for debug
    /*Message({
      message: '系統異常',
      type: 'error',
      duration: 5 * 1000,
      offset:150
    })*/
    router.push('/error')
    return Promise.reject(error)
  }
)

export default service
