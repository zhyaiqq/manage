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
  let authList = localStorage.getItem('authRoute')
  let companyId = localStorage.getItem('companyId')
  if (!isLogin) {
    // 没有登录
    if (to.path != '/login') {
      router.push('/login')
    } else {
      next()
    }
  } else {
    // 已经登录  判断是否有权限
    if (authList) {
      authList = JSON.parse(authList)
      let url1 = authList.find(item => item.match(/^\/\w+$/))
      if (to.path == '/login' || to.path == '/') {
        if (authList[0].match(/\/\w+\/:/)) {
          if (companyId) {
            let url2 = authList[0].replace(':id', companyId)
            router.push(url2)
          } else {
            router.push(url1)
          }
        } else {
          router.push(url1)
        }
      } else {
        next();
      }
    } else {
      next()
    }
  }
});

router.onReady(() => {
  generateRoutes(router)
})

export default router
