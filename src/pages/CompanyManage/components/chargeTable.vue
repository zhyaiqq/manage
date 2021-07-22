<template>
  <div class="company_list">
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
    <div class="table-btns">
      <el-button type="primary" @click="handle(1)" v-show="isHasAuth(180)" size="small">追加余额</el-button>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{textAlign: 'center'}"
      border
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
        prop="handle"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handle(2, scope.row)" v-show="isHasAuth(182)">删除</el-button>
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
      title="追加余额"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="form" ref="form" :rules="rules" label-width="200px" :inline="true">
        <el-form-item label="追加公司:">
          {{ companyName }}
        </el-form-item>
        <el-form-item label="追加金额:" prop="money">
          <el-input v-model="form.money"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="recharge">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCutLogList, delCutLog } from '@/api/charge.js'
import { recharge } from '@/api/company.js'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      formInline: {
        username: ''
      },
      form: {
        money: ''
      },
      rules: {
        money: { required: true, message: '请输入金额', trigger: 'change' }
      },
      tableData: [],
      multipleSelection: [],
      page: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogVisible: false
    }
  },
  props: ['companyId', 'companyName'],
  created () {
    this.getCutLogList(1)
  },
  computed: {
    ...mapState("menu", ['defaultAuth'])
  },
  methods: {
    handleSelectionChange () {},
    handleCurrentChange (page) {
      this.getCutLogList(page)
    },
    search () {
      this.getCutLogList(1)
    },
    handle (type, data) {
      switch (type) {
        case 1:
          // 追加余额
          this.dialogVisible = true
          break;
        case 2: 
          // 删除
          this.delCutLog(data.id)
          break;
      }
    },
    // 扣费记录列表
    getCutLogList (page) {
      getCutLogList({
        username: this.formInline.username,
        company_id: this.companyId,
        page: page
      }).then(res => {
        if (res.code) {
          this.tableData = res.data
          this.page = page
          this.pageTotal = res.count
        }
        console.log('扣费记录列表', res)
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
    },
    // 删除扣费记录
    delCutLog (id) {
      delCutLog({
        log_id: id
      }).then(res => {
        if (res.code) {
          this.getCutLogList(1)
          this.$message.success('删除成功')
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