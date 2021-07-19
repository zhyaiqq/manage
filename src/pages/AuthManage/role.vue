<template>
  <div class="company_list">
    <div class="search_top">
      <el-form :inline="true" :model="formInline" class="left">
        <el-form-item>
          <el-input v-model="formInline.username" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="right">
        <el-button type="primary" @click="handle(0)" v-show="isHasAuth(210)">新增角色</el-button>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="角色名称" />
      <el-table-column
        prop="create_at"
        label="添加时间" />
      <el-table-column
        prop="status"
        label="是否启用">
        <template slot-scope="scope">
          {{scope.row.status ? '启用' : '禁用'}}
        </template>
      </el-table-column>
      <el-table-column
        prop="desc"
        label="描述" />
      <el-table-column
        width="200px"
        prop="handle"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handle(1, scope.row)" v-show="isHasAuth(217)">权限设置</el-button>
          <el-button type="text" @click="handle(2, scope.row)" v-show="isHasAuth(211)">编辑</el-button>
          <el-button type="text" @click="handle(3, scope.row)" v-show="isHasAuth(215)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="pageSize"
      :total="pageTotal"
      layout="total, prev, pager, next, jumper"
      background>
    </el-pagination>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      @closed="closeDialog">
      <el-form :model="form" ref="form" label-width="100px">
        <el-form-item label="角色名称:" prop="name" required>
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="职能描述:" prop="describe" required>
          <el-input type="textarea" v-model="form.describe"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRoleList, delRole, addRole, editRole } from '@/api/role.js'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      formInline: {
        username: '',
        role_id: ''
      },
      tableData: [],
      multipleSelection: [],
      dialogVisible: false,
      dialogTitle: '新增角色',
      form: {
        name: '',
        describe: ''
      },
      pageTotal: 0,
      pageSize: 10,
      page: 1,
      currentRow: null
    }
  },
  created () {
    this.getRoleList(1)
  },
  computed: {
    ...mapState("menu", ['defaultAuth'])
  },
  methods: {
    handleSelectionChange () {},
    search () {
      this.getRoleList(1)
    },
    handleCurrentChange (page) {
      this.getRoleList(page)
    },
    handle (type, data) {
      switch (type) {
        case 0:
          // 新增角色
          this.dialogVisible = true
          this.dialogTitle = '新增角色'
          break;
        case 1:
          // 权限设置
          this.$router.push(`/auth?role_id=${data.id}&role_name=${data.title}`)
          break;
        case 2:
          // 编辑
          this.currentRow = data
          this.dialogTitle = '编辑角色'
          this.form.name = data.title
          this.form.describe = data.desc
          this.dialogVisible = true
          break;
        case 3:
          // 删除
          this.delRole(data.id)
          break;
      }
    },
    closeDialog () {
      this.form = this.$options.data().form
      this.$refs.form && this.$refs.form.resetFields()
    },
    confirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.dialogTitle === '新增角色') {
            this.addRole()
          } else {
            this.editRole()
          }
        }
      })
    },
    // 获取角色列表
    getRoleList (page) {
      getRoleList({
        role_name: this.formInline.username,
        page: page,
        page_num: 10
      }).then(res => {
        if (res.code) {
          this.tableData = res.data
          this.pageTotal = res.count
          this.page = page
        }
      })
    },
    // 删除角色
    delRole (id) {
      delRole({
        role_id: id
      }).then(res => {
        if (res.code) {
          this.getRoleList()
          this.$message.success('删除成功')
        }
      })
    },
    // 新增角色
    addRole () {
      addRole(this.form).then(res => {
        if (res.code) {
          this.dialogVisible = false
          this.getRoleList()
          this.$message.success('角色新增成功')
        }
      })
    },
    // 编辑角色
    editRole () {
      editRole({
        id: this.currentRow.id,
        ...this.form
      }).then(res => {
        if (res.code) {
          this.dialogVisible = false
          this.getRoleList()
          this.$message.success('角色编辑成功')
        }
      })
    },
    isHasAuth (auth_id) {
      return this.defaultAuth && this.defaultAuth.some(item => item.id == auth_id)
    }
  }
}
</script>

<style scoped>

</style>