import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { userGetInfoService } from '@/api/user'

// 用户模块 存储用户信息 token 登录setToken   退出removeToken
export const useUserStore = defineStore(
  'big_User',
  () => {
    const token = ref('')
    const setToken = (newValue) => {
      token.value = newValue
    }
    const removeToken = () => {
      token.value = ''
    }
    const user = ref({})
    const getUser = async () => {
      const res = await userGetInfoService()
      // 请求拦截器已统一返回 response.data，若后端在 data 字段中返回用户信息则使用 res.data，否则直接使用 res
      user.value = (res && res.data) || res || {}
    }
    const setUser = (obj) => {
      user.value = obj
    }
    return { token, setToken, removeToken, user, getUser, setUser }
  },
  {
    persist: {
      persist: true,
    },
  },
)
