import { useUserStore } from '@/stores/modules/user'
import axios from 'axios'
import router from '@/router'
import { ElMessage } from 'element-plus'

const baseURL = 'http://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  baseURL,// 基础地址：以后写请求只写 '/login'，它会自动拼成 'http://big-event.../login'
  timeout: 100000// 基础地址：以后写请求只写 '/login'，它会自动拼成 'http://big-event.../login'
})

instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    // 如果用户手里有 Token (身份证)
    if (userStore.token) {
      // 把它塞到请求头 (Headers) 的 Authorization 字段里
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    // 约定：code === 0 代表业务成功
    if (res.data.code === 0) {
      return res // 只有成功了，页面才能拿到数据
    }
    // 如果 code 不等于 0 (比如密码错误)，直接弹窗报错，并抛出异常
    ElMessage({ message: res.data.message || '服务异常', type: 'error' })
    return Promise.reject(res.data)
  },
  (err) => {
    // 这里处理 HTTP 错误 (比如 401, 500)
    // 如果是 401 (身份证过期/未登录)，强制踢回登录页
    if (err.response?.status === 401) {
      router.push('/login')
    }
    // ... 其他错误提示
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
