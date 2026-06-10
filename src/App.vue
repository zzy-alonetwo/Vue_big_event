<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useRoute, useRouter } from 'vue-router'
import { useCounterStore, useUserStore } from './stores'
const Counter = useCounterStore()
const big_User = useUserStore()
const Router = useRouter()
const Route = useRoute()
function golist() {
  console.log(Router, Route)
  Router.push('/list')
}
</script>

<template>
  <hr />
  <RouterView></RouterView>
  <hr />
  <hr />
  <div>我是App</div>
  <button @click="this.$router.push('/home')">跳转首页</button>
  <button @click="golist">跳转列表页</button>
  <p>{{ big_User.token }}</p>
  <el-button @click="big_User.setToken('帅气的ZZY')">登录</el-button>
  <el-button @click="big_User.removeToken">退出</el-button>
  <hr />
  <p>{{ Counter.count }}</p>
  <el-button type="success" @click="Counter.add(1)">+</el-button>
  <el-button type="success" @click="Counter.add(-1)">-</el-button>
</template>

<style scoped></style>
