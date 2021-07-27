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
      <el-button type="primary" @click="handle(1)" v-show="isHasAuth(163)" size="small">修改五险比例</el-button>
      <el-button type="primary" @click="handle(2)" v-show="isHasAuth(165)" size="small">导出社保数据</el-button>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{textAlign: 'center'}"
      border
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="120" />
      <el-table-column
        prop="sex"
        label="性别"
        width="120">
        <template slot-scope="scope">
          {{ scope.row && scope.row.sex ? '男': '女' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="card_id"
        width="190px"
        label="身份证号" />
      <el-table-column
        prop="age"
        width="120px"
        label="出生日期" />
      <el-table-column
        prop="tel"
        width="120px"
        label="联系方式"/>
      <el-table-column
        prop="address"
        label="住址"
        width="200px"
        show-overflow-tooltip/>
      <el-table-column
        prop="nation"
        label="民族"/>
      <el-table-column
        prop="registered"
        label="户口性质"/>
      <el-table-column
        prop="contract_start_time"
        width="170px"
        label="入职日期">
      </el-table-column>
      <el-table-column
        prop="education"
        label="教育程度"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="salary"
        label="薪资待遇"
        width="120px"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="long"
        label="服务时长" />
      <el-table-column
        prop="current_address"
        label="用工所在地"
        width="200px"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        prop="base_time"
        width="170px"
        label="参保时间" />
      <el-table-column
        prop="is_base"
        label="参保类型">
        <template slot-scope="scope">
          {{ scope.row && scope.row.is_base  == 1 ? '基数参保': '工资参保' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="wages_perce"
        width="180px"
        label="参保基数">
      </el-table-column>
      <el-table-column
        prop="is_stop_string"
        label="社保状态" />
      <el-table-column
        prop="social_remark"
        label="备注"
        show-overflow-tooltip />
      <el-table-column
        prop="company_pension"
        label="养老保险（企业认缴）"/>
      <el-table-column
        prop="person_pension"
        label="养老保险（个人认缴）"/>
      <el-table-column
        prop="company_unemployment"
        label="失业保险（企业认缴）"/>
      <el-table-column
        prop="person_unemployment"
        label="失业保险（个人认缴）"/>
      <el-table-column
        prop="company_medical"
        label="医疗保险（企业认缴）"/>
      <el-table-column
        prop="person_medical"
        label="医疗保险（个人认缴）"/>
      <el-table-column
        prop="company_injury"
        label="工伤保险（企业认缴）"/>
      <el-table-column
        prop="person_injury"
        label="工伤保险（个人认缴）"/>
      <el-table-column
        prop="company_birth"
        label="生育保险（企业认缴）"/>
      <el-table-column
        prop="person_birth"
        label="生育保险（个人认缴）"/>
      <el-table-column
        prop="company_accumulation"
        label="公积金（企业认缴）"/>
      <el-table-column
        prop="person_accumulation"
        label="公积金（个人认缴）"/>
      <el-table-column
        width="150px"
        prop="handle"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handle(3, scope.row)" v-show="isHasAuth(156)">编辑</el-button>
          <el-button type="text" @click="handle(4, scope.row)" v-show="isHasAuth(159)">备注</el-button>
          <el-button type="text" @click="handle(5, scope.row)" v-show="isHasAuth(161)">
            {{ scope.row && scope.row.is_stop == 0 ? '在保' : '停保'}}
          </el-button>
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
    <a ref="downloadFile"></a>
    <el-dialog
      title="修改五险比例"
      :visible.sync="dialogVisible"
      width="70%"
      @closed="closeDialog(0)">
      <el-form :model="form" ref="form" :rules="rules" label-width="200px" :inline="true">
        <el-form-item label="养老保险（企业认缴）:" prop="company_pension">
          <el-input v-model="form.company_pension"/>
        </el-form-item>
        <el-form-item label="养老保险（个人认缴）:" prop="person_pension">
          <el-input v-model="form.person_pension"/>
        </el-form-item>
        <el-form-item label="失业保险（企业认缴）:" prop="company_unemployment">
          <el-input v-model="form.company_unemployment "/>
        </el-form-item>
        <el-form-item label=" 失业保险（个人认缴）:" prop="person_unemployment">
          <el-input v-model="form.person_unemployment"/>
        </el-form-item>
        <el-form-item label="医疗保险（企业认缴）:" prop="company_medical">
          <el-input v-model="form.company_medical"/>
        </el-form-item>
        <el-form-item label="医疗保险（个人认缴）:" prop="person_medical">
          <el-input v-model="form.person_medical"/>
        </el-form-item>
        <el-form-item label="工伤保险（企业认缴）:" prop="company_injury">
          <el-input v-model="form.company_injury"/>
        </el-form-item>
        <el-form-item label="工伤保险（个人认缴）:" prop="person_injury">
          <el-input v-model="form.person_injury"/>
        </el-form-item>
        <el-form-item label="生育保险（企业认缴）:" prop="company_birth">
          <el-input v-model="form.company_birth"/>
        </el-form-item>
        <el-form-item label=" 生育保险（个人认缴）:" prop="person_birth">
          <el-input v-model="form.person_birth"/>
        </el-form-item>        
        <el-form-item label="公积金（企业认缴）:" prop="company_accumulation">
          <el-input v-model="form.company_accumulation"/>
        </el-form-item>
        <el-form-item label="公积金（个人认缴）:" prop="person_accumulation">
          <el-input v-model="form.person_accumulation"/>
        </el-form-item>
        <el-form-item label="参保时间:" prop="base_time" v-show="dialogTitle == '员工社保'">
          <el-date-picker
            v-model="form.base_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="参保类型:" prop="type" v-show="dialogTitle == '员工社保'">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="基数参保" :value="1" /> 
            <el-option label="工资参保" :value="2" /> 
          </el-select>
        </el-form-item>
        <el-form-item label="参保基数:" prop="wages_perce" v-show="dialogTitle == '员工社保' && form.type == 2">
          <el-input v-model="form.wages_perce" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="socialConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="社保备注"
      :visible.sync="dialogVisible2"
      width="30%"
      @closed="closeDialog(1)">
      <el-form :model="form1" ref="form1" :rules="rules1" label-width="100px">
        <el-form-item label="员工:" prop="staff_id">
          {{ currentRow && currentRow.name }}
        </el-form-item>
        <el-form-item label="备注信息:" prop="remark_string">
          <el-input type="textarea" v-model="form1.remark_string"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getSocialList, addCompanySocial, stop, remarkSocial, editPersonSocial, getSocialInfo } from '@/api/social_insurance.js'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      formInline: {
        username: ''
      },
      form: {
        company_pension: '',
        company_unemployment: '',
        company_medical: '',
        company_injury: '',
        company_birth: '',
        company_accumulation: '',
        person_pension: '',
        person_unemployment: '',
        person_medical: '',
        person_injury: '',
        person_birth: '',
        person_accumulation: '',
        company_id: '',
        user_id: '',
        base_time: '',
        wages_perce: '',
        type: ''
      },
      rules: {
        company_pension: { required: true, message: '请输入养老保险（企业认缴）', trigger: 'change' },
        company_unemployment: { required: true, message: '请输入失业保险（企业认缴）', trigger: 'change' },
        company_medical: { required: true, message: '请输入医疗保险（企业认缴）', trigger: 'change' },
        company_injury: { required: true, message: '请输入工伤保险（企业认缴）', trigger: 'change' },
        company_birth: { required: true, message: '请输入生育保险（企业认缴）', trigger: 'change' },
        company_accumulation: { required: true, message: '请输入公积金（企业认缴）', trigger: 'change' },
        person_pension: { required: true, message: '请输入养老保险（个人认缴）', trigger: 'change' },
        person_unemployment: { required: true, message: '请输入失业保险（个人认缴）', trigger: 'change' },
        person_medical: { required: true, message: '请输入医疗保险（个人认缴）', trigger: 'change' },
        person_injury: { required: true, message: '请输入工伤保险（个人认缴）', trigger: 'change' },
        person_birth: { required: true, message: '请输入生育保险（个人认缴）', trigger: 'change' },
        person_accumulation: { required: true, message: '请输入公积金（个人认缴）', trigger: 'change' },
        company_id: { required: true, message: '公司不能为空', trigger: 'change' },
        user_id: { required: true, message: '员工不能为空', trigger: 'change' },
        base_time: { required: true, message: '请选择参保时间', trigger: 'change' },
        // wages_perce: { required: true, message: '请输入用户名', trigger: 'change' },
        type: { required: true, message: '请选择参保类型', trigger: 'change' },
      },
      form1: {
        staff_id: '',
        remark_string: ''
      },
      rules1: {
        staff_id: { required: true, message: '员工不能为空', trigger: 'change' },
        remark_string: { required: true, message: '请输入备注信息', trigger: 'change' },
      },
      tableData: [],
      multipleSelection: [],
      page: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogVisible: false,
      dialogTitle: '公司社保',
      currentRow: null,
      dialogVisible2: false
    }
  },
  props: ['companyId'],
  created () {
    this.getSocialList(1)
  },
  computed: {
    ...mapState("menu", ['defaultAuth']),
  },
  methods: {
    handleSelectionChange () {},
    handleCurrentChange (page) {
      this.getSocialList(page)
    },
    search () {
      this.getSocialList(1)
    },
    handle (type, data) {
      let subjects = [
        'company_pension',
        'company_unemployment',
        'company_medical',
        'company_injury',
        'company_birth',
        'company_accumulation',
        'person_pension',
        'person_unemployment',
        'person_medical',
        'person_injury',
        'person_birth',
        'person_accumulation',
        'company_id',
        'user_id',
        'base_time',
        'wages_perce',
        'typ']
      switch (type) {
        case 1:
          this.dialogVisible = true
          break;
        case 2:
          // 导出社保名单
          this.$refs.downloadFile.target = '_blank';
          this.$refs.downloadFile.href = `http://rlzypq.samowl.cn/api/getSocialListExcel?company_id=${this.companyId}&username=${this.formInline.username}&token=${localStorage.getItem('token')}`
          this.$refs.downloadFile.click();
          break;
        case 3:
          // 编辑
          getSocialInfo({
            user_id: data.user_id,
            company_id: this.companyId
          }).then(res => {
            if (res.code) {
              this.dialogTitle = '员工社保'
              this.currentRow = data
              for (let i = 0; i < subjects.length; i++) {
                this.form[subjects[i]] = res.data[subjects[i]]
              }
              this.form.type = res.data.is_base
              this.dialogVisible = true
            }
          })
          break;
        case 4:
          this.currentRow = data
          this.form1.staff_id = this.currentRow.id
          this.dialogVisible2 = true
          // 备注
          break;
        case 5:
          this.currentRow = data
          // 停保
          this.stop()
          break;
      }
    },
    closeDialog (type) {
      switch(type) {
        case 0:
          this.form = this.$options.data().form
          this.$refs.form.resetFields()
          break;
        case 1:
          this.form1 = this.$options.data().form1
          this.$refs.form1.resetFields()
          break;
      }
    },
    socialConfirm () {
      this.$refs.form.validate((value) => {
        if (!value) return
        if (this.dialogTitle == '公司社保') {
          this.addCompanySocial()
          return
        }
        this.editPersonSocial()
      })
    },
    confirm () {
      this.$refs.form1.validate((valid) => {
        if (valid) this.remarkSocial()
      })
    },
    // 获取社保名单
    getSocialList (page) {
      getSocialList({
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
    // 修改五险比例
    addCompanySocial () {
      addCompanySocial({
        ...this.form,
        company_id: this.companyId
      }).then(res => {
        if (res.code) {
          this.dialogVisible = false
          this.$message.success('修改五险比例成功')
        }
      })
    },
    // 员工停保
    stop () {
      stop({
        staff_id: this.currentRow.id
      }).then(res => {
        if (res.code) {
          this.$message.success('停保成功')
          this.getSocialList(1)
        }
      })
    },
    // 社保备注
    remarkSocial () {
      remarkSocial({
        staff_id: this.currentRow.id,
        remark_string: this.form1.remark_string
      }).then(res => {
        if (res.code) {
          this.dialogVisible2 = false
          this.getSocialList(1)
        }
      })
    },
    editPersonSocial () {
      editPersonSocial({
        ...this.form,
        user_id: this.currentRow.id
      }).then(res => {
        if (res.code) {
          this.dialogVisible = false
          this.getSocialList(1)
          this.$message.success('编辑成功')
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