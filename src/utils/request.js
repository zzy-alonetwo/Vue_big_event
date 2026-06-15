import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import router from '@/router'
const baseURL = 'https://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  baseURL,
  timeout: 10000,
})
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    // return config
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  },
)

instance.interceptors.response.use(
  (response) => {
    // 假设后端成功码为 0
    console.log('响应拦截器:', response.data) // 调试用
    const biz = response.data
    const ok = biz?.code === 0 || biz?.status === 0
    if (ok) {
      return biz // 确保总是返回业务对象
    }
    // 处理业务错误，返回一个带错误信息的对象而不是 reject
    return Promise.reject({
      code: biz?.code ?? biz?.status ?? -1,
      message: biz?.message || '请求失败',
      response: response,
    })
  },
  (error) => {
    // 处理网络错误
    return Promise.reject({
      code: error.response?.status || 500,
      message: error.response?.data?.message || error.message || '网络错误',
      response: error.response,
    })
  },
)

export default instance
export { baseURL }
