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
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        prop="name"
        label="相关人" />
      <el-table-column
        prop="money"
        label="收款金额" />
      <el-table-column
        prop="company_name"
        label="扣费公司" />
      <el-table-column
        prop="company_name"
        label="扣款金额" />
      <el-table-column
        prop="company_money"
        label="公司账户余额" />
      <el-table-column
        prop="creat_at"
        label="扣费时间" />
      <el-table-column
        prop="sex_string"
        label="扣费类型" />
      <el-table-column
        prop="sex_string"
        label="上次扣费时间" />
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="pageSize"
      :total="pageTotal"
      layout="total, prev, pager, next, jumper"
      background>
    </el-pagination>
  </div>
</template>

<script>
import { getCutLogList } from '@/api/charge.js'
import { recharge } from '@/api/company.js'
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
      id: ''
    }
  },
  props: ['companyId', 'companyName'],
  created () {
    const { id } = this.$route.query
    this.id = id
    this.getCutLogList(1)
  },
  methods: {
    handleSelectionChange () {},
    handleCurrentChange (page) {
      this.getCutLogList(page)
    },
    search () {
      this.getCutLogList(1)
    },
    handle (type) {
      switch (type) {
        case 1:
          this.dialogVisible = true
          break;
      }
    },
    // 扣费记录列表
    getCutLogList (page) {
      getCutLogList({
        username: this.formInline.username,
        company_id: this.id,
        page: page
      }).then(res => {
        if (res.code) {
          this.tableData = res.data
          this.page = page
          this.pageTotal = res.count
        }
      })
    },
    // 账户充值
    recharge () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          recharge({
            company_id: this.companyId,
            money: this.form.money
          }).then(res => {
            if (res.code) {
              this.dialogVisible = false
              this.$message.success('充值成功')
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>