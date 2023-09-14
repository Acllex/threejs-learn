import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/learn1',
      name: 'learn1',
      component: () => import('../views/learn-1.vue')
    },
    {
      path: '/learn2',
      name: 'learn2',
      component: () => import('../views/learn-2.vue')
    }
  ]
})

export default router