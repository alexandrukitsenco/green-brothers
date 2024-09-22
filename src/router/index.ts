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
      ],
      meta: { requiresGuest: true }
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
  const isAuthenticated = pb.authStore.isValid

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Si la ruta requiere autenticación y el usuario no está autenticado
    next({ name: 'login' })
  } else if (to.meta.requiresGuest && isAuthenticated) {
    // Si la ruta es para invitados (auth routes) y el usuario está autenticado
    next({ name: 'home' })
  } else {
    // En cualquier otro caso, permite la navegación
    next()
  }
})

export default router
