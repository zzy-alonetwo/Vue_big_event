import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 用户模块 存储用户信息 token 登录setToken   退出removeToken
export const useUserStore = defineStore(
  'big_User',
  () => {
    const token = ref('')
    const setToken = (newValue) => {
      token.value = newValue
    }
    const removeToken = () => {
      token.value = ' '
    }
    return { token, setToken, removeToken }
  },
  {
  persist:{
    persist:true
  }  
}
)
