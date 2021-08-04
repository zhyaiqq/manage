const dynamic_routes = [
  {
    path: '/company',
    name: 'company',
    component: () => import('@/pages/CompanyManage/index.vue'),
    meta: {
      title: '公司管理'
    }
  },
  {
    path: '/companyadd',
    name: 'companyadd',
    component: () => import('@/pages/CompanyManage/add.vue'),
    meta: {
      title: '新增公司'
    }
  },
  {
    path: '/companylist',
    name: 'companylist',
    component: () => import('@/pages/CompanyManage/list.vue'),
    meta: {
      title: '公司列表'
    }
  },
  {
    path: '/companylist/:id',
    name: 'companylistdetail',
    component: () => import('@/pages/CompanyManage/detail.vue'),
    meta: {
      title: '公司列表'
    }
  },
  {
    path: '/companydetail/:id',
    name: 'companydetail',
    component: () => import('@/pages/CompanyManage/detail.vue'),
    meta: {
      title: '公司详情',
      hideHead: true
    }
  },
  {
    path: '/costRecord',
    name: 'costRecord',
    component: () => import('@/pages/CompanyManage/costRecord.vue'),
    meta: {
      title: '公司列表'
    }
  },
  {
    path: '/recharge',
    name: 'recharge',
    component: () => import('@/pages/CompanyManage/recharge.vue'),
    meta: {
      title: '公司列表'
    }
  },
  {
    path: '/todolist',
    name: 'todolist',
    component: () => import('@/pages/CompanyManage/todoList.vue'),
    meta: {
      title: '待办事'
    }
  },
  {
    path: '/todolist/:id',
    name: 'tododetail',
    component: () => import('@/pages/CompanyManage/todoDetail.vue'),
    meta: {
      title: '待办事'
    }
  },
  {
    path: '/role',
    name: 'role',
    component: () => import('@/pages/AuthManage/role.vue'),
    meta: {
      title: '角色管理'
    }
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/pages/AuthManage/user.vue'),
    meta: {
      title: '用户管理'
    }
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/pages/AuthManage/auth.vue'),
    meta: {
      title: '权限配置'
    }
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/pages/SystemSet/account.vue'),
    meta: {
      title: '账户设置'
    }
  },
  {
    path: '/log',
    name: 'log',
    component: () => import('@/pages/SystemSet/log.vue'),
    meta: {
      title: '操作日志'
    }
  },
  {
    path: '/fiveInsurances',
    name: 'fiveInsurances',
    component: () => import('@/pages/SystemSet/fiveInsurances.vue'),
    meta: {
      title: '五险基数设置'
    }
  },
  {
    path: '/remind',
    name: 'remind',
    component: () => import('@/pages/SystemSet/remind.vue'),
    meta: {
      title: '提醒设置'
    }
  }
]

export function generateRoutes(router) {
  let authList = localStorage.getItem('authRoute')
  if (!authList) return
  authList = JSON.parse(authList)
  const newRoutes = authList && authList.map(item => {
    let result = dynamic_routes.find(item1 => item1.path == item)
    return result
  })
  router.addRoute('Home', {
    path: '/',
    redirect: newRoutes[0]
  })
  newRoutes.forEach(route => {
    router.addRoute('Home', route)
  })
  router.addRoute('Home', {
    path: '*',
    redirect: '/404'
  })
  console.log(router)
}