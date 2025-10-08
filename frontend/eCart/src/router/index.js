import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import ProductDetails from '../pages/ProductDetails.vue'

const routes = [
  {
    path: '/',
    component: HomePage
  },
  {
    path: '/product/:id',
    component: ProductDetails,
    props: true
  },
  {
    path: '/payment-history',
    component: () => import('../pages/PaymentHistory.vue'),
  },
  {
    path: '/cart',
    component: () => import('../pages/Cart.vue'),
  },
   {
  path: '/parent',
  name: 'parent',
  component: () => import('../pages/Parent.vue'),
   },
   {
  path: '/child/:userName/:pwd',
  name: 'child',
  component: () => import('../pages/Child.vue'),
  props: true
   },
  
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
