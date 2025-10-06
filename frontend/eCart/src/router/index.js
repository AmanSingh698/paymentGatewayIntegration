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
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
