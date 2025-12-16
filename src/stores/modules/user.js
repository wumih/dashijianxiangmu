import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '../../api/user'
// 用户模块
export const useUserStore = defineStore(
  'big-user',// 1. 仓库的名字（ID），将来在 LocalStorage 里也会叫这个名字
  () => {
    const token = ref('') // 定义 token 定义数据：刚开始是空的
    const setToken = (t) => (token.value = t) // 设置 token 定义动作：怎么修改这个数据
    const removeToken = () => (token.value = '')
    const user = ref({}) // 1. 准备一个空盘子

    const getUser = async () => {
      // 2. 跳转A：调用上面的接口方法，给后端打电话
      const res = await userGetInfoService()
      // 3. 拿到菜（数据）后，放在盘子（user）里
      user.value = res.data.data
    }
    const setUser = (obj) => (user.value = obj)

    return { token, setToken, removeToken, user, getUser, setUser }
  },
  {
    persist: true // 持久化
  }
)
