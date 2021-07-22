<template>
  <div class="auth_wrap">
    <div class="top">当前角色：{{role_name}}</div>
    <el-card v-for="(item, index) in authList" :key="index" class="auth_group">
      <div slot="header" class="clearfix">
        <el-checkbox v-model="item.select" @change="change(item)">{{item.title}}</el-checkbox>
      </div>
      <ul class="item_wrap">
        <li v-for="(item1, index) in item.child"  :key="index" class="item">
          <el-checkbox 
            v-model="item1.select"
            border>
            {{item1.title}}
          </el-checkbox>
        </li>
      </ul>
    </el-card>
    <div class="btns">
      <el-button type="primary" @click="allSelect">全选</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getRoleAuth, updateAuthRole } from '@/api/role.js'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      role_id: '',
      role_name: '',
      authList: []
    }
  },
  computed: {
    ...mapState("company", ['menuCompanyList']),
    ...mapState("user", ['userInfo']),
    ...mapState("menu", ['authMenuList']),
  },
  created () {
    const { role_id, role_name } = this.$route.query
    this.role_id = role_id
    this.role_name = role_name
    this.getRoleAuth()
  },
  methods: {
    // 获取权限列表
    getRoleAuth () {
      getRoleAuth({
        role_id: this.role_id
      }).then(res => {
        if (res.code) {
          let authList = res.data && res.data.filter(item => item.pid == 0)
          let newAuth = []
          let level2 = []
          let level3 = []
          console.log('authlist', authList)
          authList && authList.map(item => {
            level2 = []
            item.child && item.child.map(item1 => {
              level2.push({...item1, child: null})
              level3 = []
              item1.child && item1.child.map(item2 => {
                level3.push({...item2, child: null})
              })
              level2 = [...level2, ...level3]
            })
            newAuth.push({...item, child: level2})
          })
          console.log('dddd', newAuth)
          this.authList = newAuth
        }
      })
    },
    // 添加角色权限
    updateAuthRole (ids) {
      updateAuthRole({
        role_id: this.role_id,
        auth_id: ids
      }).then(res => {
        if (res.code) {
          this.$message.success('添加角色权限成功')
        }
      })
    },
    change (row) {
      row && row.child.map(item => {
        item.select = row.select
      })
    },
    allSelect () {
      this.authList && this.authList.map(item => {
        item.select = true
        item.child && item.child.map(item1 => {
          item1.select = true
        })
      })
    },
    save () {
      let ids = []
      this.authList && this.authList.map(item => {
        item.child && item.child.map(item1 => {
          if (item1.select) {
            ids.push(item1.id)
            ids.push(item.id)
          }
        })
      })
      ids = new Set(ids)
      ids= [...ids]
      this.updateAuthRole(ids)
    }
  }
}
</script>

<style lang="less" scoped>
.auth_wrap {
  .top {
    margin-bottom: 20px;
  }
  .auth_group {
    margin-bottom: 20px;
  }
  .item_head {
    height: 50px;
    display: flex;
    align-items: center;
    padding-left: 20px;
    border-bottom: 1px solid #ccc;
  }
  .item_wrap {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding: 30px 20px
  }
  .item {
    width: 150px;
    height: 60px;
    padding-left: 20px;
    display: flex;
    align-items: center;
    // border: 1px solid #ccc;
  }
  .btns {
    text-align: center;
    margin-bottom: 20px;
    .el-button {
      margin: 0 15px;
      width: 120px;
    }
  }
}
</style>