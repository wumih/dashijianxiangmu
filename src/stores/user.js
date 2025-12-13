import { defineStore } from 'pinia'
import { ref } from 'vue'

// 用户模块
export const useUserStore = defineStore(
  'big-user',// 1. 仓库的名字（ID），将来在 LocalStorage 里也会叫这个名字
  () => {
    const token = ref('') // 定义 token 定义数据：刚开始是空的
    const setToken = (t) => (token.value = t) // 设置 token 定义动作：怎么修改这个数据

    return { token, setToken }
  },
  {
    persist: true // 持久化
  }
)
