import { createRouter, createWebHistory } from 'vue-router'

import HelloWorld from '../components/HelloWorld.vue'
import UniformView from '../components/UniformView.vue'
import OffSuppView from '../components/OffSuppView.vue'

const routes = [
  {
    path: '/',
    component: HelloWorld
  },

  {
    path: '/categories/uniforms',
    component: UniformView
  },

  {
    path: '/categories/office supplies',
    component: OffSuppView
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
