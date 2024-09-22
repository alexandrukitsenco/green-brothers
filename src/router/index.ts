import { createRouter, createWebHistory } from 'vue-router'
import PocketBase from 'pocketbase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'auth',
      component: () => import('../views/AuthView.vue'),
      children: [
        {
          path: '',
          redirect: { name: 'login' }
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('../views/LoginView.vue')
        },
        {
          path: 'signup',
          name: 'signup',
          component: () => import('../views/SignupView.vue')
        }
      ]
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const pb = new PocketBase('https://green-brothers.pockethost.io')
  if (to.meta.requiresAuth && !pb.authStore.isValid) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router
