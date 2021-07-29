<template>
  <div class="company_list">
  <!--
    <div class="search_top">
      <el-form :inline="true" :model="formInline" class="left">
        <el-form-item>
          <el-input v-model="formInline.username" placeholder="请输入姓名" @keyup.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    -->
    <el-table
      :data="tableData"
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{textAlign: 'center'}"
      border
      @selection-change="handleSelectionChange">
      <el-table-column
        prop="username"
        label="充值人" />
      <el-table-column
        prop="money"
        label="充值金额" />
      <el-table-column
        prop="create_time"
        label="充值时间" />
      <el-table-column
        prop="yu_money"
        label="账户余额" />
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
import { getRecharge } from '@/api/charge.js'
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
    this.getRecharge(1)
  },
  methods: {
    handleSelectionChange () {},
    handleCurrentChange (page) {
      this.getRecharge(page)
    },
    search () {
      this.getRecharge(1)
    },
    handle (type) {
      switch (type) {
        case 1:
          this.dialogVisible = true
          break;
      }
    },
    // 充值记录列表
    getRecharge (page) {
      getRecharge({
        company_id: this.id,
        page: page
      }).then(res => {
        if (res.code) {
          this.tableData = res.data
          this.page = page
          this.pageTotal = res.count
        }
      })
    }
  }
}
</script>

<style scoped>

</style>