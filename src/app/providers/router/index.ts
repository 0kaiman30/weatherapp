import { createRouter, createWebHistory } from 'vue-router'
import AppLayout from './ui/AppLayout/AppLayout.vue'
import { TodoPage, WeatherPage } from '../../../pages/index'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', component: WeatherPage },
      { path: 'todos', component: TodoPage},
    ],
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
