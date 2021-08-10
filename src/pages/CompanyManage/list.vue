<template>
  <div class="company_list">
    <div class="search_top">
      <el-form :inline="true" :model="formInline" class="left">
        <el-form-item label="公司名称:" prop="company">
          <el-input v-model="formInline.company" placeholder="请输入公司名称" @keyup.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
          <el-select v-model="formInline.status" placeholder="请选择" @change="search">
            <el-option label="启动" :value="1" /> 
            <el-option label="禁用" :value="0" /> 
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{textAlign: 'center'}"
      border
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55" />
      <el-table-column
        prop="id"
        label="编号"
        width="120" />
      <el-table-column
        prop="name"
        label="公司名称"
        width="120px"
        show-overflow-tooltip />
      <el-table-column
        width="200px"
        prop="address"
        label="公司地址"
        show-overflow-tooltip />
      <el-table-column
        prop="corporation"
        label="公司法人"
        show-overflow-tooltip />
      <el-table-column
        prop="money"
        label="费用余额"
        show-overflow-tooltip />
      <el-table-column
        prop="business"
        label="营业执照">
        <template slot-scope="scope">
          <img :src="scope.row.business" style="width: 80px;height:80px"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="charge_person"
        label="负责人"
        show-overflow-tooltip />
      <el-table-column
        prop="tel"
        label="负责人电话"
        width="120px"
        show-overflow-tooltip />
      <el-table-column
        prop="status"
        label="状态">
        <template slot-scope="scope">
          {{ scope.row && scope.row.status ? '启用中': '已禁用' }}
        </template>
      </el-table-column>
      <el-table-column
        width="350px"
        prop="handle"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handle(0, scope.row)">
            {{ scope.row && scope.row.status ? '禁用': '启用' }}
          </el-button>
          <el-button type="text" @click="handle(1, scope.row)">详情</el-button>
          <el-button type="text" @click="handle(2, scope.row)" :disabled="!scope.row.status">编辑</el-button>
          <el-button type="text" @click="handle(3, scope.row)">账户充值</el-button>
          <el-button type="text" @click="handle(4, scope.row)" v-show="isHasAuth(178)">扣费记录</el-button>
          <el-button type="text" @click="handle(5, scope.row)" v-show="isHasAuth(178)">充值记录</el-button>
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
      title="余额充值"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :model="form" ref="form" label-width="100px">
        <el-form-item label="充值公司：" prop="company">
          {{ currentCompany && currentCompany.name || '--'}}
        </el-form-item>
        <el-form-item label="充值金额：" prop="address">
          <el-input v-model="form.money"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onRecharge">充值</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCompanyList, banCompany, recharge } from '@/api/company.js'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      formInline: {
        company: '',
        status: ''
      },
     tableData: [],
      multipleSelection: [],
      dialogVisible: false,
      form: {
        company: '',
        money: ''
      },
      pageTotal: 0,
      pageSize: 10,
      page: 1,
      currentCompany: null
    }
  },
  created () {
    this.getDataList(1)
  },
  computed: {
    ...mapState("menu", ['defaultAuth'])
  },
  methods: {
    handleSelectionChange () {

    },
    search () {
      this.getDataList(1)
    },
    handleCurrentChange (page) {
      this.getDataList(page)
    },
    handle (type, data) {
      switch (type) {
        case 0:
          this.changeStatus(data)
          break
        case 1:
          this.$router.push(`/companylist/${data.id}`)
          break;
        case 2:
          this.$router.push(`/companylist/${data.id}?action=edit`)
          break;
        case 3:
          this.currentCompany = data
          this.dialogVisible = true
          break;
        case 4:
          this.$router.push(`/costRecord?id=${data.id}`)
          break;
        case 5:
          this.$router.push(`/recharge?id=${data.id}`)
          break;
      }
    },
    // 获取公司列表
    getDataList (page) {
      getCompanyList({
        company_name: this.formInline.company,
        status: this.formInline.status,
        page: page,
        page_num: 10
      }).then(res => { 
        this.tableData = res.data
        this.pageTotal = res.count
        this.page = page
      })
    },
    // 禁用or启用公司
    changeStatus (item) {
      banCompany({
        company_id: item.id
      }).then(res => {
        if (res.code) {
          this.getDataList(this.page)
        }
      })
    },
    // 账户充值
    onRecharge () {
      recharge({
        company_id: this.currentCompany.id,
        money: this.form.money
      }).then(res => {
        if (res.code) {
          this.dialogVisible = false
          this.getDataList(this.page)
          this.$message.success('充值成功')
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