import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      // name: login,
      component: () => import('@/views/login/LoginPage.vue'),
    },
    {
      path: '/',
      // name: layout,
      component: () => import('@/views/layout/LayoutContainer.vue'),
      redirect: '/article/manage',
      children: [
        {
          path: '/article/manage',
          // name: manage,
          component: () => import('@/views/article/ArticleManage.vue'),
        },
        {
          path: '/article/channel',
          // name: channel,
          component: () => import('@/views/article/ArticleChannel.vue'),
        },
        {
          path: '/user/profile',
          // name: profile,
          component: () => import('@/views/user/userProfile.vue'),
        },
        {
          path: '/user/avatar',
          // name: avatar,
          component: () => import('@/views/user/UserAvatar.vue'),
        },
        {
          path: '/user/password',
          // name: password,
          component: () => import('@/views/user/UserPassword.vue'),
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const useStore = useUserStore()
  if (!useStore.token && to.path !== '/login') return '/login'

  return true
})
export default router
