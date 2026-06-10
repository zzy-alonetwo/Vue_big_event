import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import router from '@/router'
const base_url = 'https://big-event-vue-api-t.itheima.net/'

const instance = axios.create({
  baseURL: base_url,
  timeout: 10000,
})
instance.interceptors.request.use(
  (config) => {
    // TODO 2. 携带token
    // return config
    const userStore = useUserStore()
    if (userStore.token) config.headers.Authorization = userStore.token
    return config
  },
  (err) => {
    Promise.reject(err)
  },
)

instance.response.use(
  (res) => {
    // TODO 4. 摘取核心响应数据
    if (res.response.code === 0) return res

    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res.data)
  },
  (err) => {
    // TODO 3. 处理业务失败
    // 错误的特殊情况 => 401 权限不足 或 token 过期 => 拦截到登录
    if (err.response?.status === 401) return router.push('/login')

    // 错误的默认情况 => 只要给提示
    ElMessage.error(err.response.data.message || '服务异常')
    return Promise.reject(err)
  },
)

export default instance
export { baseURL }
