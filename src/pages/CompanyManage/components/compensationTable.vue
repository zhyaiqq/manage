<template>
  <div class="company_list">
    <div class="search_top">
      <el-form :inline="true" :model="formInline" class="left">
        <el-form-item>
          <el-input v-model="formInline.username" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="right">
        <el-button type="primary" @click="handle(1)"  v-show="isHasAuth(186)">新增补偿</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{textAlign: 'center'}"
      border
      @selection-change="handleSelectionChange">
      <el-table-column
        prop="name"
        label="被补偿人" />
      <el-table-column
        prop="money"
        label="补偿金额" />
      <el-table-column
        prop="company_name"
        label="补偿公司" />
      <el-table-column
        prop="company_money"
        label="公司账户余额" />
      <el-table-column
        prop="sex_string"
        label="补偿原因" />
      <el-table-column
        prop="company_money"
        label="公司账户余额" />
      <el-table-column
        prop="creat_at"
        label="补偿时间" />
      <!--
      <el-table-column
        prop="sex_string"
        label="被补偿人电话" />
      -->
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
      title="新增补偿金"
      :visible.sync="dialogVisible"
      width="50%">
      <el-form :model="form" ref="form" label-width="200px" :inline="true">
        <el-form-item label="补偿公司:" prop="company_id" required>
          <el-select v-model="form.company_id" placeholder="请选择" @change="selectCompany">
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in companyList" :key="index" /> 
          </el-select> 
        </el-form-item>
        <el-form-item label="被补偿人:" prop="user_id" required>
          <el-select v-model="form.user_id" placeholder="请选择">
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in userList" :key="index" /> 
          </el-select> 
        </el-form-item>
        <el-form-item label="退费以及补偿原因:" prop="remark" required>
          <el-input v-model="form.remark"/>
        </el-form-item>
        <el-form-item label="补偿金额:" prop="money" required>
          <el-input v-model="form.money"/>
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
import { getCutLog3, addCompensate } from '@/api/compensation.js'
import { getCompanyList } from '@/api/company.js'
import { getDispatchList } from '@/api/staff.js'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      formInline: {
        username: ''
      },
      form: {},
      tableData: [],
      multipleSelection: [],
      page: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogVisible: false,
      companyList: [],
      userList: []
    }
  },
  props: ['companyId'],
  created () {
    this.getCompanyList()
    this.getCutLog3(1)
  },
  computed: {
    ...mapState("menu", ['defaultAuth'])
  },
  methods: {
    handleSelectionChange () {},
    handleCurrentChange (page) {
      this.getCutLog3(page)
    },
    search () {
      this.getCutLog3(1)
    },
    handle (type) {
      switch (type) {
        case 1:
          this.dialogVisible = true
          break;
      }
    },
    selectCompany () {
      this.getDispatchList(this.form.company_id)
    },
    confirm () {
      this.$refs.form.validate((valid) => {
        if (valid) this.addCompensate()
      })
    },
    // 补偿金列表
    getCutLog3 (page) {
      getCutLog3({
        username: this.formInline.username,
        company_id: this.companyId,
        page: page
      }).then(res => {
        if (res.code) {
          this.tableData = res.data
          this.page = page
          this.pageTotal = res.count
        }
      })
    },
    // 获取公司列表
    getCompanyList () {
      getCompanyList({
        page: 1,
        page_num: 1000
      }).then(res => {
        if (res.code) this.companyList = res.data
      })
    },
    // 获取派遣人员列表
    getDispatchList (company_id) {
      getDispatchList({
        company_id: company_id,
        page: 1,
        page_num: 1000
      }).then(res => {
        if (res.code) this.userList = res.data
      })
    },
    // 新增补偿金
    addCompensate () {
      addCompensate(this.form).then(res => {
        if (res.code) {
          this.dialogVisible = false
          this.getCutLog3(1)
          this.$message.success('新增成功')
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