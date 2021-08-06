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
      localStorage.removeItem('token')
      localStorage.removeItem('authRoute')
      localStorage.removeItem('companyId')
      router.push('/login')
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
    case 0:
      Message.error(message)
      break
  }
}

const instance = axios.create({
  baseURL: 'http://rlzypq.samowl.cn',
  // baseURL: 'http://116.63.143.166:8001',
  // baseURL: '',
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
    } else if (res.status === 200) {
      errorHandle(res.data.code, res.data?.info)
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
