<template>
  <div class="company_list">
    <div class="search_top">
      <el-form :inline="true" :model="formInline" class="left">
        <el-form-item>
          <el-select v-model="formInline.role_id" placeholder="全部角色" @change="search">
            <el-option label="全部角色" value=""/>
            <el-option :label="item.title" :value="item.id" v-for="(item, index) in roleList" :key="index" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="formInline.username" placeholder="请输入姓名" @keyup.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-btns">
      <el-button type="primary" @click="handle(0)" v-show="isHasAuth(222)" size="small">新增用户</el-button>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{textAlign: 'center'}"
      border>
      <el-table-column
        prop="username"
        label="用户名称" />
      <el-table-column
        prop="nickname"
        label="昵称" />
      <el-table-column
        prop="contact_mail"
        label="邮箱" />
      <el-table-column
        prop="role_name"
        label="角色类型" />
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
        prop="login_at"
        label="上次登录" />
      <el-table-column
        width="200px"
        prop="handle"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handle(4, scope.row)" v-show="scope.row.is_password">修改密码</el-button>
          <el-button type="text" @click="handle(2, scope.row)" v-show="isHasAuth(223)">编辑</el-button>
          <el-button type="text" @click="handle(3, scope.row)" v-show="isHasAuth(227)">删除</el-button>
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
      @closed="closeDialog(0)">
      <el-form :model="form" ref="form" :rules="rules" label-width="100px">
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称:" prop="nickname">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password" v-if="dialogTitle == '新增用户'">
          <el-input v-model="form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="password2" v-if="dialogTitle == '新增用户'">
          <el-input v-model="form.password2" type="password"></el-input>
        </el-form-item>
        <el-form-item label="角色类型:" prop="role_id">
          <el-select v-model="form.role_id" placeholder="全部角色">
            <el-option :label="item.title" :value="item.id" v-for="(item, index) in roleList" :key="index" />
          </el-select>
        </el-form-item>
        <el-form-item label="头像:" prop="headimg">
          <el-upload
            class="avatar-uploader"
            action="http://rlzypq.samowl.cn/api/upFile"
            name="image"
            :show-file-list="false"
            :on-success="uploadSuccess">
            <div class="upload-success-cn">
              <img :src="file.http" v-show="form.headimg" style="width: 100%; height: 100%" />
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="公司权限:" prop="company_id">
          <el-tree
            ref="tree"
            :data="companyList"
            show-checkbox
            node-key="id"
            default-expand-all
            :props="defaultProps"
            @check-change="handleCheckChange" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>    
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible2"
      width="30%"
      @closed="closeDialog(1)">
      <el-form :model="form2" ref="form2" :rules="rules2" label-width="100px">
        <el-form-item label="用户名:" prop="user_id">
          {{this.currentRow && this.currentRow.username}}
        </el-form-item>
        <el-form-item label="新密码:" prop="new_password">
          <el-input v-model="form2.new_password"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码:" prop="new_password2">
          <el-input v-model="form2.new_password2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="confirmPwd">确 定</el-button>
      </span>
    </el-dialog>  </div>
</template>

<script>
import { getUserList, getRoleList, addUser, editUser, delUser, edPassword2 } from '@/api/role.js'
import { getCompanySelect } from '@/api/company.js'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      formInline: {
        username: '',
        role_id: ''
      },
      tableData: [],
      dialogVisible: false,
      dialogTitle: '新增用户',
      form: {
        username: '',
        nickname: '',
        password: '',
        password2: '',
        role_id: '',
        headimg: '',
        email: '',
        company_id: []
      },
      rules: {
        username: { required: true, message: '请输入用户名', trigger: 'change' },
        nickname: { required: true, message: '请输入昵称', trigger: 'change' },
        password: { required: true, message: '请输入密码', trigger: 'change' },
        password2: { required: true, message: '请确认密码', trigger: 'change' },
        role_id: { required: true, message: '请选择角色类型', trigger: 'change' },
        email: { required: true, message: '请输入邮箱', trigger: 'change' },
        company_id: { required: true, message: '请选择公司', trigger: 'blur' },
      },
      dialogVisible2: false,
      form2: {
        user_id: '',
        new_password: '',
        new_password2: ''
      },
      rules2: {
        user_id: { required: true, message: '用户不能为空', trigger: 'change' },
        new_password: { required: true, message: '请输入新密码', trigger: 'change' },
        new_password2: { required: true, message: '请确认密码', trigger: 'change' },
      },
      pageTotal: 0,
      pageSize: 10,
      page: 1,
      roleList: [],
      currentRow: null,
      file: {
        http: '',
        url: ''
      },
      companyList: [{
        name: '全选',
        id: 0,
        children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  created () {
    this.getRoleList()
    this.getUserList(1)
  },
  computed: {
    ...mapState("menu", ['defaultAuth'])
  },
  methods: {
    handleSelectionChange () {},
    search () {
      this.getUserList(1)
    },
    handleCurrentChange (page) {
      this.getUserList(page)
    },
    handle (type, data) {
      switch (type) {
        case 0:
          // 新增用户
          this.getCompany()
          this.dialogVisible = true
          this.dialogTitle = '新增用户'
          break;
        case 2:
          // 编辑
          this.currentRow = data
          this.dialogTitle = '编辑用户'
          this.form.username = data.username
          this.form.nickname = data.nickname
          this.form.role_id = data.role_id
          this.form.headimg = data.headimg
          this.file.http = data.headimg_url
          this.file.url = data.headimg
          this.form.email = data.contact_mail
          this.form.nickname = data.nickname
          this.currentRow && this.getCompany(this.currentRow.id)
          this.dialogVisible = true
          break;
        case 3:
          // 删除
          this.delUser(data.id)
          break;
        case 4:
          // 修改密码
          this.currentRow = data
          this.form2.user_id = data.id
          this.dialogVisible2 = true
          break;
      }
    },
    uploadSuccess (res) {
      if (res.code) {
        this.form.headimg = res.data.url
        this.file.http = res.data.http
        this.file.url = res.data.url
        this.$message.success('上传成功')
      } else {
        this.$message.warning(res.info)
      }
    },
    closeDialog (index) {
      if (index) {
        this.form2 = this.$options.data().form2
        this.$refs.form2 && this.$refs.form2.resetFields()
      } else {
        this.form = this.$options.data().form
        this.$refs.form && this.$refs.form.resetFields()
      }
    },
    confirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.dialogTitle === '新增用户') {
            this.addUser()
          } else {
            this.editUser()
          }
        }
      })
    },
    confirmPwd () {
      this.$refs.form2.validate((valid) => {
        if (valid) {
          this.edPassword2()
        }
      }) 
    },
    handleCheckChange () {
      this.form.company_id = this.$refs.tree.getCheckedKeys()
    },
    // 获取用户列表
    getUserList (page) {
      getUserList({
        username: this.formInline.username,
        role_id: this.formInline.role_id,
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
    // 获取角色列表
    getRoleList () {
      getRoleList({
        page_num: 1000
      }).then(res => {
        if (res.code) {
          this.roleList = res.data
        }
      })
    },
    // 删除用户
    delUser (id) {
      delUser({
        user_id: id
      }).then(res => {
        if (res.code) {
          this.getUserList()
          this.$message.success('删除成功')
        }
      })
    },
    // 新增用户
    addUser () {
      addUser(this.form).then(res => {
        if (res.code) {
          this.dialogVisible = false
          this.getUserList(1)
          this.$message.success('角色新增成功')
        }
      })
    },
    // 编辑用户
    editUser () {
      editUser({
        id: this.currentRow.id,
        username: this.form.username,
        nickname: this.form.nickname,
        role_id: this.form.role_id,
        headimg: this.form.headimg,
        email: this.form.email,
        company_id: this.$refs.tree.getCheckedKeys()
      }).then(res => {
        if (res.code) {
          this.dialogVisible = false
          this.getUserList(1)
          this.$message.success('角色编辑成功')
        }
      })
    },
    // 查询公司权限
    getCompany (id) {
      getCompanySelect(id).then(res => {
        if (res.code) {
          let selected = []
          this.companyList[0].children = res.data
          res.data && res.data.map(item => {
            if (item.select) selected.push(item.id)
          })
          setTimeout(() => {
            this.$refs.tree.setCheckedKeys(this.dialogTitle == '新增用户' ? [] : selected);
          }, 300)
        }
      })
    },
    // 管理员修改密码
    edPassword2 () {
      edPassword2(this.form2).then(res => {
        if (res.code) {
          this.$message.success('修改密码成功')
          this.dialogVisible2 = false
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