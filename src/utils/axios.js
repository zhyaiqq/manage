import axios from 'axios'
// import Cookies from 'js-cookie'
import { Message } from "element-ui";
import router from '../router'

const errorHandle = (status, message) => {
  switch (status) {
    case 400:
      Message.error('请求错误(400)')
      break
    case 401:
      // Cookies.remove('catl-token')
      // instance.defaults.headers.token = ''
      localStorage.removeItem('token')
      localStorage.removeItem('authRoute')
      localStorage.removeItem('companyId')
      router.push('/login')
      // Message.error('未授权，请重新登录(401)')
      Message.error(message)
      break
    case 403:
      Message.error('拒绝访问(403)')
      break
    case 404:
      Message.error('请求出错(404)')
      break
    case 408:
      Message.error('请求超时(408)')
      break
    case 500:
      Message.error('服务器错误(500)')
      break
    case 501:
      Message.error('服务未实现(501)')
      break
    case 502:
      Message.error('网络错误(502)')
      break
    case 503:
      Message.error('服务不可用(503)')
      break
    case 504:
      Message.error('网络超时(504)')
      break
    case 505:
      Message.error('HTTP版本不受支持(505)')
      break
    default:
      Message.error(message)
  }
}

const instance = axios.create({
  baseURL: '/',
  timeout: 10000,
  withCredentials: false
})

instance.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = localStorage.getItem('token') || ''
    return config
  },
  (error) => Promise.error(error)
)

instance.interceptors.response.use(
  (res) => {
    if (res.headers['content-type'] == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      return Promise.resolve(res)
    } else if (res.status === 200 && res.data?.code === 1) {
      return Promise.resolve(res.data)
    } else {
      errorHandle(res.data.code, res.data?.info)
      return Promise.reject(res)
    }
  },
  (error) => {
    return Promise.reject(error)
  })

export default instance
