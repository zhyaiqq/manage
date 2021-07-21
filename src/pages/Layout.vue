<template>
  <div class="layout">
    <div class="header">
      <div class="header_left">
        <img src="../assets/imgs/logo.svg" class="logo">
        <h2>人力数据系统</h2>
      </div>
      <div class="header_right">
        <div>{{userInfo && userInfo.username}}</div>
        <div class="right_btn" @click="onLogout">退出登录</div>
        <!--<el-menu class="el-menu-demo" mode="horizontal">
          <el-submenu index="1">
            <template slot="title">{{userInfo && userInfo.username}}</template>
            <el-menu-item index="2-1">退出登录</el-menu-item>
          </el-submenu>
        </el-menu>-->
      </div>
    </div>
    <div class="cn">
      <div class="left">
        <!-- <div class="layout_company" v-if="showCompany">
          <div class="company">用工公司</div>
          <el-input v-model="company" placeholder="搜索公司" @input="search" />
          <ul class="company_menu">
            <li v-for="(item, index) in menuCompanyList" :key="index" @click="jump(0, item)" :class="{'active': item.id == companyId}">{{ item.name }}</li>
          </ul>
        </div>-->
        <el-menu
          :default-active="menuActive"
          :default-openeds="openMenus"
          active-text-color="#269cff"
          class="left_menu"
          @open="handleOpen"
          @close="handleClose">
          <el-submenu index="0" key="0" class="layout_company">
            <div class="company">用工公司</div>
            <div class="company_menu">
              <el-input v-model="company" placeholder="搜索公司" @input="search" />
              <el-menu-item
                @click="jump(0, item1)"
                :index="String(item1.id)" 
                v-for="(item1, index) in menuCompanyList" :key="index">
                {{ item1.name }}
              </el-menu-item>
            </div>
          </el-submenu>
          <el-submenu :index="String(item.id)" v-for="(item, i) in menuList" :key="i + 1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item
              @click="jump(1, item1)"
              :index="String(item1.id)" 
              v-for="(item1, index) in item.child" :key="index">
              {{ item1.title }}
              <div class="count" v-show="item1.title == '待办事' && todoCount > 0">{{todoCount}}</div>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div class="main_cn">
        <div class="sub_header" v-show="!(pageMeta && pageMeta.hideHead)">{{ pageMeta ? (pageMeta.title === '角色管理' ? '角色成员' : pageMeta.title) : '' }}</div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
      // menuList: [
      //   {
      //     id: '1',
      //     title: '公司管理',
      //     icon: 'el-icon-location',
      //     children: [
      //       {
      //         id: '1-1',
      //         title: '新增公司',
      //         path: '/companyadd'
      //       },
      //       {
      //         id: '1-2',
      //         title: '公司列表',
      //         path: '/companylist'
      //       },
      //       {
      //         id: '1-3',
      //         title: '待办事项',
      //         path: '/todolist'
      //       },
      //     ]
      //   },
      //   {
      //     id: '2',
      //     title: '系统权限',
      //     icon: 'el-icon-location',
      //     children: [
      //       {
      //         id: '2-1',
      //         title: '角色管理',
      //         path: '/role'
      //       }
      //       // {
      //       //   id: '2-2',
      //       //   title: '权限配置',
      //       //   path: '/auth'
      //       // }
      //     ]
      //   },
      //   {
      //     id: '3',
      //     title: '系统设备',
      //     icon: 'el-icon-location',
      //     children: [
      //       {
      //         id: '3-1',
      //         title: '账户设置',
      //         path: '/account'
      //       },
      //       {
      //         id: '3-2',
      //         title: '操作日志',
      //         path: '/log'
      //       },
      //       {
      //         id: '3-3',
      //         title: '五险基数设置',
      //         path: '/fiveInsurances'
      //       },
      //       {
      //         id: '3-4',
      //         title: '提醒设置',
      //         path: '/remind'
      //       },
      //     ]
      //   }
      // ],
      pageMeta: {},
      menuActive: '',
      companyList: [],
      company: '',
      companyId: '',
      timer: null,
      openMenus: ['0']
    }
  },
  created () {
    const { meta, path } = this.$route
    console.log('eeeeeeeeeeeee', path)
    this.companyId = ''
    this.pageMeta = meta
    this.getMen().then(() => {
      let result = path.match(/\/companydetail\/(\d+)/)
      if (result) {
        this.menuActive = result[1]
        this.companyId = result[1]
      } else {
        this.searchCurrentMenu(this.menuList, meta.title)
      }
    })
    this.getUserInfo()
    this.getMenuCompany()
    this.getExcelUrl()
    this.getStaffList()
    this.getNewsNum()
  },
  computed: {
    ...mapState("company", ['menuCompanyList']),
    ...mapState("user", ['userInfo']),
    ...mapState("menu", ['todoCount', 'authMenuList', 'menuList', 'showCompany']),
  },
  watch: {
    $route(to) {
      const { meta, path, params: {id} } = to
      this.companyId = ''
      this.pageMeta = meta
      if (path.includes('/companydetail/')) { 
        this.companyId = id
        this.menuActive = ''
      }
    }
  },
  methods: {
    ...mapActions('company', ['getMenuCompany', 'getStaffList']),
    ...mapActions('user', ['getUserInfo']),
    ...mapActions("menu", ['getExcelUrl', 'getNewsNum', 'getMen']),
    searchCurrentMenu (arr, title) {
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element.title === title) {
          this.menuActive = String(element.id)
          break;
        } else {
          if (element.child && element.child.length > 0) this.searchCurrentMenu(element.child, title)
        }
      }
    },
    handleOpen(key) {
      if (key == 0) return
      this.openMenus = ['0', key]
    },
    handleClose(key) {
      if (key == 0) return
      console.log('rwerewrwerewrwerwerr-------')
      this.openMenus = ['0']
    },
    jump (type, item) {
      const { path, params: { id } } = this.$route
      switch (type) {
        case 0:
          if (id != item.id) {
            this.$router.push(`/companydetail/${item.id}`)
          }
          break;
        case 1:
          if (path != item.url) {
            this.$router.push(item.url)
          }
          break;
      }
    },
    search () {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        this.getMenuCompany({company_name: this.company})
        clearTimeout(this.timer)
        this.timer = null
      }, 500)
    },
    onLogout () {
      this.$confirm('确定要退出登录吗？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('authRoute')
        localStorage.removeItem('companyId')
        this.$router.push('/login') 
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '@/assets/css/common.less';
.layout {
  height: 100%;
}
.header {
  padding: 0 15px;
  height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: @primaryColor1;
  .header_left {
    display: flex;
    flex-direction: row;
    align-items: center;
    .logo {
      width: 40px;
      margin-right:20px;
    }
    h2 {
      color: #fff;
      font-size: 20px;
    }
  }
  .header_right {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 14px;
    .right_btn {
      font-size: 12px;
      margin-left: 20px;
      cursor: pointer;
    }
  }
}
.cn {
  width: 100%;
  height: calc(100% - 70px);
  display: flex;
  flex-direction: row;
  .left {
    width: 200px;
    background-color: #fff;
  }
  .left_menu {
    width: 200px;
    .count {
      position: absolute;
      right: 30px;
      top: 15px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #f00;
      color: #fff;
      text-align: center;
      line-height: 20px;
      font-size: 10px;
    }
  }
  .main_cn {
     width: 100%;
     padding: 0 30px;
     overflow-y: scroll;
    .sub_header {
      height: 50px;
      line-height: 50px;
      font-weight: bold;
      color: #666;
      padding-left: 30px;
      border-bottom: 1px solid #ccc;
      background-color: #fff;
      position: relative;
      &::after {
        position: absolute;
        top: 17px;
        left: 15px;
        content: '';
        width: 3px;
        height: 16px;
        background-color: @primaryColor1;
      }
    }
  }
}
</style>
<style lang="less">
.layout_company {
  .company {
    height: 50px;
    line-height: 50px;
    padding: 0 45px;
    font-size: 14px;
  }
  .el-input {
    width: 150px;
    margin-left: 15px;
    .el-input__inner {
      height: 30px;
      border-radius: 30px;
    }
  }
  .el-submenu__title {
    display: none;
  }
  .company_menu {
    height: 200px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}
</style>