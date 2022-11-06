import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path:'/',
    redirect:'/wsp'
  },{
    path:'/sellerPage',
    component:() => import('../views/sellerPage.vue')
  },{
    path:'/trendPage',
    component:() => import('../views/trendPage.vue')
  },{
    path:'/wsp',
    component:() => import('../views/wsp.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
