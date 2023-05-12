import { createRouter, createWebHistory } from 'vue-router'
import UploadFile from '@/views/UploadFile.vue'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/home" },
    {
      path: '/home',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/upload',
      component: UploadFile
    }
  ]
})

export default router
