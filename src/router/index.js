import Vue from "vue"
import VueRouter from "vue-router"
import { generateRoutes } from '@/utils/fn.js'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login/index.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Layout.vue'),
    children: []
  }
]


const router = new VueRouter({
  mode: 'history',
  routes
})


router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem('token')
  if (!isLogin) {
    if (to.path != '/login') {
      router.push('/login')
    } else {
      next()
    }
  } else {
    if (to.path == '/login') {
      router.push('/companylist')
    }
    next();
  }
});

router.onReady(() => {
  generateRoutes(router)
})

export default router
