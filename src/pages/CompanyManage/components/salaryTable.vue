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
        <el-upload
          v-show="isHasAuth(174)"
          style="display:inline-block; margin-right: 20px"
          action="/api/excel_salary"
          :data="{'company_id': companyId}"
          name="excel"
          :headers="authorization"
          :show-file-list="false">
          <el-button type="primary">导入薪资数据</el-button>
        </el-upload>
        <el-button type="primary" @click="handle(1)" v-show="isHasAuth(176)">导出薪资数据</el-button>
        <el-button type="primary" @click="handle(2)" v-show="isHasAuth(174)">下载薪资模板</el-button>
      </div>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"/>
      <el-table-column
        prop="sex"
        label="性别">
        <template slot-scope="scope">
          {{ scope.row && scope.row.sex ? '男': '女' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="card_id"
        label="身份证号" />
      <el-table-column
        prop="department"
        label="部门" />
      <el-table-column
        prop="position"
        label="职位" />
      <el-table-column
        prop="salary"
        label="基本工资" />
      <el-table-column
        prop="post_salary"
        label="岗位工资"/>
      <el-table-column
        prop="post_allowance"
        label="岗位津贴"/>
      <el-table-column
        prop="post_check"
        label="考核工资"/>
      <el-table-column
        prop="post_work"
        label="出勤工资"/>
      <el-table-column
        prop="post_education"
        label="学历工资">
      </el-table-column>
      <el-table-column
        prop="post_title"
        label="职称工资"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="post_age"
        label="工龄工资"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="post_tax"
        label="扣税额" />
      <el-table-column
        prop="person_pension"
        label="养老保险"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="person_accident"
        label="意外伤害保险"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="person_unemployment"
        label="失业险"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="person_medical"
        label="医疗保险"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="person_accumulation"
        label="住房公积金"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="post_management"
        label="管理费"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="remak"
        label="备注"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        width="150px"
        prop="handle"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handle(3, scope.row)" v-show="isHasAuth(169)">编辑</el-button>
          <el-button type="text" @click="handle(4, scope.row)" v-show="isHasAuth(172)">备注</el-button>
        </template>
      </el-table-column>
    </el-table>
    <a ref="downloadFile"></a>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="pageSize"
      :total="pageTotal"
      layout="total, prev, pager, next, jumper"
      background>
    </el-pagination>
    <el-dialog
      title="编辑薪资信息"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form :model="form" ref="form" label-width="200px">
        <el-form-item label="基本工资:" prop="salary" required>
          <el-input v-model="form.salary"/>
        </el-form-item>
        <el-form-item label="绩效工资:" prop="achievements" required>
          <el-input v-model="form.achievements"/>
        </el-form-item>
        <el-form-item label="银行卡号:" prop="bank_card" required>
          <el-input v-model="form.bank_card" />
        </el-form-item>
        <el-form-item label="所属银行:" prop="bank" required>
          <el-input v-model="form.bank" />
        </el-form-item>
        <el-form-item label="发薪日期:" prop="pay_date" required>
          <el-date-picker
            v-model="form.pay_date"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="薪资备注"
      :visible.sync="dialogVisible2"
      width="30%">
      <el-form :model="form2" ref="form2" label-width="100px">
        <el-form-item label="姓名:" prop="psu_id" required>
          {{ currentRow && currentRow.name }}
        </el-form-item>
        <el-form-item label="备注信息:" prop="remark_string" required>
          <el-input type="textarea" v-model="form2.remark_string"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="remakSalary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getStaffSalaryList, editSalary, remakSalary } from '@/api/salary.js'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      formInline: {
        username: ''
      },
      form: {
        'salary': '',
        'achievements': '',
        'bank': '',
        'bank_card': '',
        'pay_date': ''
      },
      form2: {},
      tableData: [],
      multipleSelection: [],
      page: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogVisible: false,
      dialogVisible2: false,
      currentRow: null,
      authorization: { 'Authorization': localStorage.getItem('token') }
    }
  },
  props: ['companyId'],
  created () {
    this.getStaffSalaryList(1)
  },
  computed: {
    ...mapState("menu", ['excellUrls', 'defaultAuth'])
  },
  methods: {
    handleSelectionChange () {},
    handleCurrentChange (page) {
      this.getStaffSalaryList(page)
    },
    search () {
      this.getStaffSalaryList(1)
    },
    handle (type, data) {
      let subjects = ['salary', 'achievements', 'bank', 'bank_card', 'pay_date']
      switch (type) {
        case 1:
          // 导出薪资数据
          this.downFile(`/api/getStaffSalaryListExcel?company_id=${this.companyId}&username=${this.formInline.username}&token=${localStorage.getItem('token')}`)
          break;
        case 2:
          // 下载薪资模板
          this.downFile(this.excellUrls.money)
          break;
        case 3:
          // 编辑
          for (let i = 0; i < subjects.length; i++) {
            this.form[subjects[i]] = data[subjects[i]]
          }
          this.currentRow = data
          this.dialogVisible = true
          break;
        case 4:
          // 备注
          this.currentRow = data
          this.form2.psu_id = this.currentRow.psu_id
          this.dialogVisible2 = true
          break;
      }
    },
    confirm () {
      this.$refs.form.validate((valid) => {
        if (valid) this.editSalary()
      })
    },
    // 员工薪资列表
    getStaffSalaryList (page) {
      getStaffSalaryList({
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
    // 薪资备注
    remakSalary () {
      this.$refs.form2.validate((valid) => {
        if (valid) {
          remakSalary(this.form2).then(res => {
            if (res.code) {
              this.dialogVisible2 = false
              this.getStaffSalaryList(this.page)
              this.$message.success('备注成功')
            }
          })
        }
      })
    },
    // 编辑薪资信息
    editSalary () {
      editSalary({
        psu_id: this.currentRow.psu_id,
        ...this.form
      }).then(res => {
        if (res.code) {
          this.dialogVisible = false
          this.getStaffSalaryList(this.page)
          this.$message.success('编辑成功')
        }
      })
    },
    // 导出薪资数据
    downFile (url) {
      this.$refs.downloadFile.target = '_blank';
      this.$refs.downloadFile.href = url
      this.$refs.downloadFile.click();
    },
    isHasAuth (auth_id) {
      return this.defaultAuth && this.defaultAuth.some(item => item.id == auth_id)
    }
  }
}
</script>

<style scoped>

</style>