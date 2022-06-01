import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login-vachoco.vue'
import Pedidos from '../views/Pedidos-actuales.vue'
import AppLayout from '../App-Layout.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/AppLayout',
    name: 'AppLayout',
    component: AppLayout,
    children: [{
      path: '/Pedidos/:id',
      name: 'Pedidos',
      component: Pedidos
    },]
  },

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
