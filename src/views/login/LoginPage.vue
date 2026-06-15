<script setup>
import { ref, watch } from 'vue'
import { userRegisterService, userLoginService } from '@/api/user'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
const isRegister = ref(false)
const form = ref(null)

// 1. 定义表单数据
const formData = ref({
  username: '',
  password: '',
  repassword: '',
})

// 自定义校验：确认密码
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== formData.value.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

// 2. 定义校验规则
const formRules = {
  // 用户名校验
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 10, message: '用户名必须是 5-10位 的字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur',
    },
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      pattern: /^\S{6,15}$/,
      message: '密码必须是 6-15位 的非空字符',
      trigger: 'blur',
    },
    {
      validator: (rule, value, callback) => {
        // 判断 value 和 当前 form 中收集的 password 是否一致
        if (value !== formData.value.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback() // 就算校验成功，也需要callback
        }
      },
      trigger: 'blur',
    },
  ],
}
const register = async () => {
  try {
    await form.value.validate()
    await userRegisterService(formData.value) // 注意是 .value
    ElMessage.success('注册成功')
    isRegister.value = false
  } catch (error) {
    console.error('注册失败:', error)
    ElMessage.error('注册失败')
  }
}
watch(isRegister, () => {
  form.value.resetFields()
})

const userStore = useUserStore()
const router = useRouter()
/* const login = async () => {
  await form.value.validate()
  const res = await userLoginService(formData.value)
  console.log(res, formData.value)
  console.log(res.data)
  userStore.setToken(res.data.token)
  ElMessage.success('登录成功')
  router.push('/')
} */
const login = async () => {
  try {
    await form.value.validate()
  } catch (error) {
    console.log('表单验证失败:', error)
    return
  }

  try {
    // 准备登录数据
    const loginData = {
      username: formData.value.username,
      password: formData.value.password,
    }

    const res = await userLoginService(loginData)
    console.log('登录响应:', res) // 调试用

    // ✅ 修正：token 直接在 res 对象下，不是 res.data.token
    if (res && res.code === 0 && res.token) {
      // 注意：返回的 token 已经包含 "Bearer " 前缀
      userStore.setToken(res.token) // 直接保存 token
      ElMessage.success('登录成功')
      router.push('/')
    } else {
      ElMessage.error(res?.message || '登录失败')
    }
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error(error.message || error.response?.data?.message || '登录失败，请稍后重试')
  }
}
</script>

<template>
  <!-- 
    1. 结构相关
      el-row表示一行，一行分成24份 
       el-col表示列  
       (1) :span="12"  代表在一行中，占12份 (50%)
       (2) :span="6"   表示在一行中，占6份  (25%)
       (3) :offset="3" 代表在一行中，左侧margin份数

       el-form 整个表单组件
       el-form-item 表单的一行 （一个表单域）
       el-input 表单元素（输入框）
    2. 校验相关
       (1) el-form => :model="ruleForm"      绑定的整个form的数据对象 { xxx, xxx, xxx }
       (2) el-form => :rules="rules"         绑定的整个rules规则对象  { xxx, xxx, xxx }
       (3) 表单元素 => v-model="ruleForm.xxx" 给表单元素，绑定form的子属性
       (4) el-form-item => prop配置生效的是哪个校验规则 (和rules中的字段要对应)
  -->
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册相关表单 -->
      <el-form
        :model="formData"
        :rules="formRules"
        ref="form"
        label-width="100px"
        v-if="isRegister"
      >
        <!-- 2. el-form-item 表单项 -->
        <!-- 3.1用户名 -->
        <el-form-item label="用户名" prop="username">
          <!-- 3. 表单控件 -->
          <el-input v-model="formData.username" placeholder="请输入用户名" :prefix-icon="User" />
        </el-form-item>
        <!-- 3.2密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
          />
        </el-form-item>
        <!-- 3.3再次输入密码 -->
        <el-form-item label="密码效验" prop="repassword">
          <el-input v-model="formData.repassword" type="password" placeholder="请再次输入密码" />
        </el-form-item>
        <!-- 4. 提交按钮 -->
        <el-form-item>
          <el-form-item>
            <el-button @click="register" class="button" type="primary" auto-insert-space>
              注册
            </el-button>
          </el-form-item>
          <el-form-item class="flex">
            <el-link type="info" :underline="false" @click="isRegister = false"> ← 返回 </el-link>
          </el-form-item>
        </el-form-item>
      </el-form>

      <!-- 登录相关表单 -->
      <el-form :model="formData" :rules="formRules" ref="form" label-width="100px" v-else>
        <!-- 2. el-form-item 表单项 -->
        <!-- 3.1用户名 -->
        <el-form-item label="用户名" prop="username">
          <!-- 3. 表单控件 -->
          <el-input v-model="formData.username" placeholder="请输入用户名" :prefix-icon="User" />
        </el-form-item>
        <!-- 3.2密码 -->
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="Lock"
          />
        </el-form-item>
        <!-- 4. 提交按钮 -->
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="login" class="button" type="primary" auto-insert-space>登录</el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true"> 注册 → </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background:
      url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
      url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>
