import { createRouter, createWebHistory } from 'vue-router'
import TopView from '@/views/TopView.vue'
import CameraView from '@/views/CameraView.vue'

const routes = [
  { path: '/', name: 'Top', component: TopView },
  { path: '/camera', name: 'Camera', component: CameraView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router