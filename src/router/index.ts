import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'learn1',
      component: () => import('../views/learn-1.vue')
    },
    {
      path: '/learn2',
      name: 'learn2',
      component: () => import('../views/learn-2.vue')
    },
    {
      path: '/learn3',
      name: 'learn3',
      component: () => import('../views/learn-3.vue')
    },
    {
      path: '/learn4',
      name: 'learn4',
      component: () => import('../views/learn-4.vue')
    },
    {
      path: '/learn5',
      name: 'learn5',
      component: () => import('../views/learn-5.vue')
    }
  ]
})

export default router
